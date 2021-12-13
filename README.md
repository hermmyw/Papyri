# Papyri

## Introduction
Communication between students and instructors is an integral part of learning success and teaching success. However, it can often be difficult to foster such communication in a college classroom environment due to class size. Papyri team recognizes the need for an application that could facilitate this, thereby allowing students to receive the help they need while also allowing instructors to more easily interact with students and gauge their level of learning in the classroom. Papyri is designed to build an interactive class system between students and instructors. Papyri offers a variety of features, such as creating/enrolling a class, taking attendance, checking attendance record, creating/answering quiz questions, reviewing past quizzes, that enable a comprehensive interaction inside and outside the classroom. Instead of the regular way of taking attendance with clickers or sign-in form, Papyri uses a revolutionary technology, Computer Vision, to allow students to sign in with facial recognition. This feature not only speeds up the sign-in process for students but also guarantees an authentic attendance for instructors. Instructors can gauge the performance and participation of students through statistics on answered poll questions and on attendance history. This level and depth of interaction among students and instructors improves the classroom by making it easier for students to receive help or clarification regarding coursework or other logistics while also allowing instructors to understand the needs of his/her students.


Angela Wu, Hermmy Wang, Lewis Hong, Neil Sonnenberg, Virgil Jose, Zhenghao Li

## Features
* The user can register as a student or an instructor
* The student user must register with five photos of himself/herself
* The registered user can view their created/enrolled class
* A student user can view his/her attendance record for a specific class
* A student user can sign in for an active class
* A student user can participate in an active class with active quiz
* An instructor user can create, start, and close a quiz question for a specific class
* An instructor can start/end a specific lecture for a specific class
* An instructor user can view the attendance report for a specific class
* An instructor user can view the quiz report for a specific class 

## Usage

Clone the repository to your local terminal

```
git clone https://github.com/hermmyw/Papyri.git
```

Navigate to the repository (e.g. /Users/yourname/Papyri) and run

```
$ npm install
```

Install any updates or fix any warnings by following the warning message

```
$ npm start
```

```
$ export PYTHONPATH=[...]/backend/papyri/facenet/src
```

where [...] should be replaced with the directory where the cloned repo resides (e.g. /Users/yourname/Papyri)

Now you should see the following message on the terminal:
```
Compiled successfully!


You can now view papyri-playground in the browser.


http://localhost:3000/
```

Open a separate terminal, run the following command to start the Django server

```
$ python backend/manage.py runserver
```