import React, {Component} from 'react';
import {MDBContainer} from 'mdbreact';
import './Table.css';
import axios from 'axios';
import TableModel from "../../data-models/TableModel";
import Spinner from "../../utils/Spinner";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    match: any,
}

interface State {
    table: TableModel
    nameInputOpen: boolean
    newTableName: string
    isLoading: boolean
}

export default class Table extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            table: new TableModel(),
            nameInputOpen: false,
            newTableName: '',
            isLoading: true
        }
        this.toggleNameInput = this.toggleNameInput.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.updateName = this.updateName.bind(this);
        this.fetchTable();
    }

    toggleFavorite = () => {
        let table = this.state.table;
        table.favourite = !table.favourite;
        this.updateTable(table)
    }

    updateTable(table: TableModel) {
        table.last_modyfied = new Date(Date.now());
        this.setState({table: table});
        axios.put(`/api/table/${this.props.match.params.id}`, table)
            .then((resp) => {
                this.setState({table: resp.data});
            });
    }

    fetchTable() {
        axios.get(`/api/table/${this.props.match.params.id}`)
            .then((resp) => {
                let table: TableModel = resp.data;
                table.last_open = new Date(Date.now());
                this.setState({table: resp.data, isLoading: false});
                axios.put(`/api/table/${this.props.match.params.id}`, table)
                    .then((resp) => {
                    });
            });

    }

    favouriteButtonStar() {
        if (this.state.table.favourite) {
            return <i className="fas fa-star"></i>
        }
        return <i className="far fa-star"></i>
    }

    toggleNameInput() {
        this.setState({nameInputOpen: !this.state.nameInputOpen})
    }

    updateName() {
        this.updateTable(this.state.table);
        this.toggleNameInput();
    }

    nameChanged(e: any) {
        let table = this.state.table;
        table.name = e.target.value;
        this.setState({table: table})
    }

    tableName() {
        if (this.state.nameInputOpen) {
            return [
                <input className="form-control" defaultValue={this.state.table.name || ''}
                       onChange={this.nameChanged}></input>,
                <button type="button" className="btn btn-primary" onClick={this.updateName}>
                    Save
                </button>,
                <button type="button" className="btn btn-danger" onClick={this.toggleNameInput}>
                    Cancel
                </button>
            ]

        } else {
            return [
                this.state.table.name,
                <button type="button" className="btn btn-success" onClick={this.toggleNameInput}>
                    Edit Name
                </button>
            ]
        }
    }

    view() {
        if (this.state.isLoading) {
            return <Spinner></Spinner>
        }
        return <MDBContainer className={'form-inline'}>

            {this.tableName()}
            <button type="button" className="btn btn-danger bmd-btn-fab" onClick={this.toggleFavorite}>
                {this.favouriteButtonStar()}
            </button>
            <div>
                {/*    TODO wyswietlic kazda liste*/}
            </div>
        </MDBContainer>
    }

    render() {
        return (
            this.view()
        );
    }
}
