import React, {Component} from 'react';
import {MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter} from 'mdbreact';
import axios from 'axios';
import TableModel from "../../data-models/TableModel";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

export default class CreateTable extends Component {
    state = {
        modal: false,
        background: '',
        name: '',
        visibility: 0,
        team: undefined,
        createDisabled: true
    };

    constructor(props: Readonly<{}>) {
        super(props);
        this.createTable = this.createTable.bind(this);
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    handleName = (event: { target: { value: any; }; }) => {
        this.setState({name: event.target.value});
    };
    handleBackground = (event: { target: { value: any; }; }) => {
        this.setState({background: event.target.value});
    };
    handleVisibility = (event: { target: { value: any; }; }) => {
        this.setState({visibility: event.target.value});
    };
    handleTeam = (event: { target: { value: any; }; }) => {
        this.setState({team: event.target.value});
    };

    createTable() {
        let table = new TableModel();
        table.name = this.state.name;
        if (this.state.background !== '') table.background = this.state.background;
        table.visibility = this.state.visibility;
        table.id_team = this.state.team;
        axios.post(`api/tables/`, {...table}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'token' + localStorage.getItem('user_token')
            }
        })
            .then(() => {
                alert('Created');
            }).catch((error: { response: any; request: any; message: any; config: any; }) => {
            if (error.response) {
                alert(error.response.data);
            } else if (error.request) {
                alert(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('Error' + error.message);
            }
        });
        this.setState({
            background: '',
            name: '',
            visibility: 0,
            team: undefined
        });
        this.toggle();
    }

    render() {
        return (
            <MDBContainer>
                <MDBBtn onClick={this.toggle}>Create new table</MDBBtn>
                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Enter table details</MDBModalHeader>
                    <MDBModalBody>

                        <div className="form-group">
                            <label>Table name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                onChange={this.handleName}
                            />
                            <label>Background url</label>
                            <input
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                onChange={this.handleBackground}
                            />
                            <select className="browser-default custom-select" onChange={this.handleVisibility}
                            >
                                <option value="0">private</option>
                                <option value="2">public</option>
                            </select>
                            <select className="browser-default custom-select" onChange={this.handleTeam}>
                                <option>Choose team</option>
                                <option value="1">private</option>
                            </select>
                        </div>

                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn id={'createButton'} onClick={this.createTable} disabled={!this.state.name}
                                color="primary">Create Table</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}