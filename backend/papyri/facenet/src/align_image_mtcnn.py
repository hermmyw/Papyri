from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

from scipy import misc
import sys
import os
import argparse
import tensorflow as tf
import numpy as np
import facenet
import align.detect_face
import random
from time import sleep

def align_face(image_path, output_path, image_size=160, margin=32, gpu_memory_fraction=1.0):
    sleep(random.random())
    output_path = os.path.expanduser(output_path)
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    # Store some git revision info in a text file in the log directory
    src_path,_ = os.path.split(os.path.realpath(__file__))
    facenet.store_revision_info(src_path, output_path, ' '.join(sys.argv))

    print('Creating networks and loading parameters')

    with tf.Graph().as_default():
        gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=gpu_memory_fraction)
        sess = tf.Session(config=tf.ConfigProto(gpu_options=gpu_options, log_device_placement=False))
        with sess.as_default():
            pnet, rnet, onet = align.detect_face.create_mtcnn(sess, None)

    minsize = 20 # minimum size of face
    threshold = [ 0.6, 0.7, 0.7 ]  # three steps's threshold
    factor = 0.709 # scale factor

    # Add a random key to the filename to allow alignment using multiple processes
    random_key = np.random.randint(0, high=99999)
    bounding_boxes_filename = os.path.join(output_path, 'bounding_boxes_%05d.txt' % random_key)
    output_filename_n = ''

    with open(bounding_boxes_filename, "w") as text_file:
        output_class_dir = output_path
        if not os.path.exists(output_class_dir):
            os.makedirs(output_class_dir)

        filename = os.path.splitext(os.path.split(image_path)[1])[0]
        output_filename = os.path.join(output_class_dir, filename+'_aligned.png')
        print("##### ",image_path, output_filename)
        if not os.path.exists(output_filename):
            try:
                img = misc.imread(image_path)
            except (IOError, ValueError, IndexError) as e:
                errorMessage = '{}: {}'.format(image_path, e)
                print(errorMessage)
            else:
                if img.ndim<2:
                    print('Unable to align "%s"' % image_path)
                    text_file.write('%s\n' % (output_filename))
                if img.ndim == 2:
                    img = facenet.to_rgb(img)
                img = img[:,:,0:3]

                bounding_boxes, _ = align.detect_face.detect_face(img, minsize, pnet, rnet, onet, threshold, factor)
                nrof_faces = bounding_boxes.shape[0]
                if nrof_faces>0:
                    det = bounding_boxes[:,0:4]
                    det_arr = []
                    img_size = np.asarray(img.shape)[0:2]
                    if nrof_faces>1:
                        bounding_box_size = (det[:,2]-det[:,0])*(det[:,3]-det[:,1])
                        img_center = img_size / 2
                        offsets = np.vstack([ (det[:,0]+det[:,2])/2-img_center[1], (det[:,1]+det[:,3])/2-img_center[0] ])
                        offset_dist_squared = np.sum(np.power(offsets,2.0),0)
                        index = np.argmax(bounding_box_size-offset_dist_squared*2.0) # some extra weight on the centering
                        det_arr.append(det[index,:])
                    else:
                        det_arr.append(np.squeeze(det))

                    for i, det in enumerate(det_arr):
                        det = np.squeeze(det)
                        bb = np.zeros(4, dtype=np.int32)
                        bb[0] = np.maximum(det[0]-margin/2, 0)
                        bb[1] = np.maximum(det[1]-margin/2, 0)
                        bb[2] = np.minimum(det[2]+margin/2, img_size[1])
                        bb[3] = np.minimum(det[3]+margin/2, img_size[0])
                        cropped = img[bb[1]:bb[3],bb[0]:bb[2],:]
                        scaled = misc.imresize(cropped, (image_size, image_size), interp='bilinear')
                        filename_base, file_extension = os.path.splitext(output_filename)
                        output_filename_n = "{}{}".format(filename_base, file_extension)
                        misc.imsave(output_filename_n, scaled)
                        text_file.write('%s %d %d %d %d\n' % (output_filename_n, bb[0], bb[1], bb[2], bb[3]))
                else:
                    print('Unable to align "%s"' % image_path)
                    text_file.write('%s\n' % (output_filename))

    print(output_filename)
    return output_filename
