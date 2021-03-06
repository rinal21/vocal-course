import React, { Component } from 'react';
import { Formik } from 'formik';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import moment from "moment";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import "react-datepicker/dist/react-datepicker.css";

export default class attendanceAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // dateSchedule: new Date(),
      day: 'Monday',
      time: '08:20',
      rooms: [],
      roomId: '',
      selectedRoom: null,
      teachers: [],
      teacherId: '',
      selectedTeacher: null,
      classes: [],
      classId: '',
      selectedClass: null,
      students: [],
      studentId: '',
      selectedStudent: null,
      selectedAttendance: '',
      redirect: false
    };
    this.onChangeDay = this.onChangeDay.bind(this);
    this.onChangeRooms = this.onChangeRooms.bind(this);
    this.onChangeTeachers = this.onChangeTeachers.bind(this);
    this.onChangeClass = this.onChangeClass.bind(this);
    this.onChangeStudents = this.onChangeStudents.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  createTimePicker = () => {
    let opt = []

    for (var i = 2019; i <= 2025; i++) {
      opt.push(<option value={i}>{i}</option>)
    }

    return (
      <select class="form-control" style={{ width: 100 }} id="year-picker" onChange={this.onChangeTime}>
        {opt}
      </select>
    )
  }

  onChangeDay(e) {
    this.setState({
      day: e.target.value
    });
  }

  onChangeTime(e) {
    this.setState({
      time: e.target.value
    });
  }

  onChangeRooms = (selectedRoom) =>  {
    this.setState({ selectedRoom });
    this.setState({ roomId: selectedRoom.value})
  }

  onChangeStudents = (selectedStudent) =>  {
    this.setState({ selectedStudent });
    this.setState({ studentId: selectedStudent.value})
    
    this.fetchTeachersByStudent(selectedStudent.value)
  }

  onChangeTeachers = (selectedTeacher) =>  {
    this.setState({ selectedTeacher });
    this.setState({ teacherId: selectedTeacher.value})
  }

  onChangeClass = (selectedClass) =>  {
    this.setState({ selectedClass });
    this.setState({ 
      classId: selectedClass.value
    })
    this.fetchStudentsByClass(selectedClass.value)
  }

  onChangeDateSchedule = dateSchedule => {
    this.setState({
      dateSchedule: dateSchedule
    });
  }

  onChangeTeachers = (selectedTeacher) =>  {
    this.setState({ selectedTeacher });
    this.setState({ teacherId: selectedTeacher.value})
  }

  componentDidMount = () => {
    // ajax call
    this.fetchRooms()
    this.fetchClasses()
  }

  fetchTeachersByStudent = (student) => {
    fetch('http://localhost:8000/api/teachers/filterStudent?student=' + student)
      .then(response => response.json())
      .then((json) => {
        this.setState({
          teachers: json.data
        })
      })
  }

  fetchStudentsByClass = (id) => {
    fetch('http://localhost:8000/api/students/filterClass?status=3&classId=' + id)
      .then(response => response.json())
      .then((json) => {
        this.setState({
          students: json
        })
      })
  }

  fetchRooms = () => {
    fetch('http://localhost:8000/api/rooms')
      .then(response => response.json())
      .then((json) => {
        this.setState({
          rooms: json.data
        })
      })
  }

  fetchClasses = () => {
    fetch('http://localhost:8000/api/classes')
      .then(response => response.json())
      .then((json) => {
        this.setState({
          classes: json.data
        })
      })
  }

  dataRooms = (rooms) => {
    console.log('coba' ,rooms)
    return (
      function () {
        let rowData = []

        rooms.map((data, index) => {
          rowData.push({
            value: data.id,
            label: data.name,
          })
        })
        return rowData
      }()
    )
  };

  dataClasses = (classes) => {
    return (
      function () {
        let rowData = []

        classes.map((data, index) => {
          rowData.push({
            value: data.id,
            label: data.name,
          })
        })
        return rowData
      }()
    )
  };

  dataStudents = (students) => {

    return (
      function () {
        let rowData = []
        students.map((student) => {
          rowData.push({
            value: student.id,
            label: student.first_name + ' ' + student.middle_name + ' ' + student.last_name,
          })
        })

        return rowData
      }()
    )
  }

  dataTeachers = (teachers) => {
    return (
      function () {
        let rowData = []
        teachers.map((data) => {
          rowData.push({
            value: data.id,
            label: data.name,
          })
        })
        return rowData
      }()
    )
  }

  onSubmit(e) {
    e.preventDefault();
    const obj = {
      // date: moment(this.state.dateSchedule).format("YYYY-MM-DD hh:mm:ss"),
      day: this.state.day,
      time: this.state.time,
      room: this.state.roomId,
      teacher: this.state.teacherId,
      student: this.state.studentId,
      class: this.state.classId,
      branch: JSON.parse(localStorage["appState"]).user.branchId
    };
    axios.post('http://localhost:8000/api/schedule', obj)
      .then(res => console.log(res.data.message))
      .then(() => this.setState({ redirect: true }))
      .catch(error => {
        alert('Duplicate Schedule')
        console.log(error.message);
      })
  }

  render() {
    console.log('coba', this.state.students)
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to='/schedule' />;
    }
    return (
      <div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={values => {
            let errors = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
            /* and other goodies */
          }) => (
              <div>
                <form onSubmit={this.onSubmit}>
                <div className="form-inline mb-2">
                    <label for="date" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Day
                    </label>
                    <label>: &nbsp;</label>
                    {/* <DatePicker
                        selected={this.state.dateSchedule}
                        onChange={this.onChangeDateSchedule}
                        dateFormat="d-MM-yyyy"
                        peekNextMonth
                        dropdownMode="select"
                        className="form-control"
                      /> */}
                      <select class="form-control" style={{ width: 224 }} id="day-picker" onChange={this.onChangeDay}>
                      <option value={'Monday'}>Monday</option>
                      <option value={'Tuesday'}>Tuesday</option>
                      <option value={'Wednesday'}>Wednesday</option>
                      <option value={'Thursday'}>Thursday</option>
                      <option value={'Friday'}>Friday</option>
                      <option value={'Saturday'}>Saturday</option>
                      <option value={'Sunday'}>Sunday</option>
                    </select>
                  </div>
                  <div className="form-inline mb-2">
                    <label for="date" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Time
                    </label>
                    <label>: &nbsp;</label>
                    <select class="form-control" style={{ width: 100 }} id="year-picker" onChange={this.onChangeTime}>
                      <option value={'08:20'}>08:20</option>
                      <option value={'09:00'}>09:00</option>
                      <option value={'09:40'}>09:40</option>
                      <option value={'10:20'}>10:20</option>
                      <option value={'11:00'}>11:00</option>
                      <option value={'11:40'}>11:40</option>
                      <option value={'12:20'}>12:20</option>
                      <option value={'13:00'}>13:00</option>
                      <option value={'13:40'}>13:40</option>
                      <option value={'14:20'}>14:20</option>
                      <option value={'15:00'}>15:00</option>
                      <option value={'15:40'}>15:40</option>
                      <option value={'16:20'}>16:20</option>
                      <option value={'17:00'}>17:00</option>
                      <option value={'17:40'}>17:40</option>
                      <option value={'18:20'}>18:20</option>
                      <option value={'19:00'}>19:00</option>
                      <option value={'19:40'}>19:40</option>
                    </select>
                  </div>
                  <div className="form-inline mb-2">
                    <label for="class" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Room
                    </label>
                    <label>: &nbsp;</label>
                    <div style={{ display: 'inline-block', width: 223.2 }}>
                      <Select
                        value={this.state.selectedRoom}
                        onChange={this.onChangeRooms}
                        options={this.dataRooms(this.state.rooms)}
                      />
                    </div>
                  </div>  
                  <div className="form-inline mb-2">
                    <label for="class" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Class
                    </label>
                    <label>: &nbsp;</label>
                    <div style={{ display: 'inline-block', width: 223.2 }}>
                      <Select
                        value={this.state.selectedClass}
                        onChange={this.onChangeClass}
                        options={this.dataClasses(this.state.classes)}
                      />
                    </div>
                  </div>
                  <div className="form-inline mb-2">
                    <label for="name" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Student Name
                  </label>
                    <label>: &nbsp;</label>
                    <div style={{ display: 'inline-block', width: 223.2 }}>
                      <Select
                        value={this.state.selectedStudent}
                        onChange={this.onChangeStudents}
                        options={this.dataStudents(this.state.students)}
                      />
                      
                    </div>
                  </div>
                  <div className="form-inline mb-2">
                    <label for="name" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Teacher Name
                  </label>
                    <label>: &nbsp;</label>
                    <div style={{ display: 'inline-block', width: 223.2 }}>
                      <Select
                        value={this.state.selectedTeacher}
                        onChange={this.onChangeTeachers}
                        options={this.dataTeachers(this.state.teachers)}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <button type="submit" class="btn btn-primary mb-2">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
        </Formik>
      </div>
    )
  }
}

