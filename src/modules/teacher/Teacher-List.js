import React, { Component } from "react";
import { MDBDataTable, MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { NavLink } from "react-router-dom";
import axios from 'axios';

export default class teacherList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      teachers: [],
      deleteConfirm: false,
      deleteId : ''
    }
    this.delete = this.delete.bind(this);
  }

  delete(id) {
    axios.delete('http://localhost:8000/api/teacher/' + id)
      .then(console.log('Deleted'))
      .then(() => this.setState({deleteConfirm: !this.state.deleteConfirm}))
      .then(() => this.fetchData())
      .catch(err => console.log(err))
  }

  toggleDeleteConfirmation = (id) => {
    this.setState({
      deleteConfirm: !this.state.deleteConfirm,
      deleteId: id
    });
  }

  componentDidMount = () => {
    // ajax call
    this.fetchData()
  }

  fetchData = () => {
    fetch('http://localhost:8000/api/teachers')
    .then(response => response.json())
    .then((json) => {
      this.setState({
        teachers: json.data
      })
    })
  }

  data = (teachers) => {
    const deleteConfirm = this.toggleDeleteConfirmation

    return ({
      columns: [
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
          width: 500
        },
        {
          label: 'Total Student',
          field: 'student',
          sort: 'asc',
          width: 500
        },
        {
          label: 'Salary',
          field: 'salary',
          sort: 'asc',
          width: 500
        },
        {
          label: 'Action',
          field: 'action',
          sort: 'disabled',
          width: 10
        }
      ],
      rows: (function () {
        let rowData = []

        teachers.map((data, index) => {
          rowData.push({
            name: data.name,
            student: data.students_count,
            salary: data.salary,
            action:
              <div>
                <NavLink
                  to={{
                    pathname: 'teacher/edit',
                    state: {
                      teacherId: data.id,
                      name: data.name,
                      salary: data.salary
                    }
                  }}
                  className="btn btn-primary">Edit</NavLink>
                <button onClick={() => deleteConfirm(data.id)} className="btn btn-danger" style={{ position: "relative", left: 25 }}>Delete</button>
              </div>
          })
        })

        return rowData
      }())
    })
  };  

    render() {
        return(
            <div>
              <div class="box-header">
                  <NavLink to="/teacher/add" class="btn btn-success"><i class="fa fa-plus"></i> Add Teacher</NavLink>
              </div>
                <MDBDataTable
                    striped
                    bordered
                    hover
                    data={this.data(this.state.teachers)}
                    btn
                />
                <MDBContainer>
              <MDBModal isOpen={this.state.deleteConfirm} toggle={this.toggleDeleteConfirmation} size="sm" centered>
                <MDBModalHeader toggle={this.toggleDeleteConfirmation}>Delete</MDBModalHeader>
                <MDBModalBody>
                  Are you sure you want to delete it ?
                </MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn color="secondary" onClick={this.toggleDeleteConfirmation}>Cancel</MDBBtn>
                  <MDBBtn color="danger" onClick={() => this.delete(this.state.deleteId)}>Delete</MDBBtn>
                </MDBModalFooter>
              </MDBModal>
            </MDBContainer>
            </div>
        )
    }
}

