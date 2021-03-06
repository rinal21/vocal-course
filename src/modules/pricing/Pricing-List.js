import React, { Component } from "react";
import { MDBDataTable, MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter  } from 'mdbreact';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import NumberFormat from 'react-number-format';

export default class pricingList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pricings: [],
      deleteConfirm: false,
      deleteId : ''
    }
    this.delete = this.delete.bind(this);
  }

  delete(id) {
    axios.delete('http://localhost:8000/api/pricing/' + id)
      .then(console.log('Deleted'))
      .then(() => this.setState({deleteConfirm: !this.state.deleteConfirm}))
      .then(() => this.fetchData())
      .catch(err => console.log(err))
  }

  componentDidMount = () => {
    // ajax call
    this.fetchData()
  }

  fetchData = () => {
    fetch('http://localhost:8000/api/pricings')
      .then(response => response.json())
      .then((json) => {
        this.setState({
          pricings: json.data
        })
      })
  }

  toggleDeleteConfirmation = (id) => {
    this.setState({
      deleteConfirm: !this.state.deleteConfirm,
      deleteId: id
    });
  }

  data = (pricings) => {
    const deleteConfirm = this.toggleDeleteConfirmation

    return ({
      columns: [
        {
          label: 'Class',
          field: 'class',
          sort: 'asc',
          width: 500
        },
        {
          label: 'Price',
          field: 'price',
          sort: 'asc',
          width: 500
        },
        // {
        //   label: 'Total Meetup',
        //   field: 'meetup',
        //   sort: 'asc',
        //   width: 500
        // },
        // {
        //   label: 'Duration',
        //   field: 'duration',
        //   sort: 'asc',
        //   width: 500
        // },
        {
          label: 'Type by Difficulty',
          field: 'difficulty',
          sort: 'asc',
          width: 500
        },
        {
          label: 'Type by Teacher',
          field: 'teacher',
          sort: 'asc',
          width: 500
        },
        {
          label: 'Type by Participant',
          field: 'participant',
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

        pricings.map((data, index) => {
          if(data.type_by_difficulty == 1){
            data.type_by_difficulty = 'Basic'
          }else if(data.type_by_difficulty == 2){
            data.type_by_difficulty = 'Intermediate'
          }else if(data.type_by_difficulty == 3){
            data.type_by_difficulty = 'Pre adv & adv'
          }

          if(data.type_by_teacher == 1){
            data.type_by_teacher = 'Regular teacher class'
          }else if(data.type_by_teacher == 2){
            data.type_by_teacher = 'Senior teacher class'
          }

          if(data.type_by_participant == 1){
            data.type_by_participant = 'Private'
          }else if(data.type_by_participant == 2){
            data.type_by_participant = 'Semi Private'
          }else if(data.type_by_participant == 3){
            data.type_by_participant = 'Group'
          }
          rowData.push({
            class: data.class_name,
            price: <NumberFormat value={data.price} displayType={'text'} thousandSeparator="." decimalSeparator="," prefix={'Rp '} />,
            // meetup: data.total_meetup,
            // duration: data.duration,
            difficulty: data.type_by_difficulty,
            teacher: data.type_by_teacher,
            participant: data.type_by_participant,
            action:
              <div>
                <NavLink
                  to={{
                    pathname: 'pricing/edit',
                    state: {
                      pricingId: data.id
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
    return (
      <>
        <section className="content-header">
          <div className="row">
            <div className="col-md-12">
              <div className="box">
                <div className="content">
                <b><h4>Pricing</h4></b>
                  <div class="box-header">
                    <NavLink to="/pricing/add" class="btn btn-success"><i class="fa fa-plus"></i> Add Pricing</NavLink>
                  </div>
                  <MDBDataTable
                    striped
                    bordered
                    hover
                    data={this.data(this.state.pricings)}
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
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }
}

