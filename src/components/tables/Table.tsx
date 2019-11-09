import React, {Component} from 'react';
import {MDBContainer} from 'mdbreact';
import axios from 'axios';
import TableModel from "../../data-models/TableModel";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    match: any,
}

interface State {
    table: TableModel
}

export default class Table extends Component<Props, State> {


    constructor(props: Props) {
        super(props);
        this.state = {
            table: new TableModel()
        }
    }

    componentDidMount() {
        this.fetchTable();
    }

    toggleFavorite = () => {
        let table = this.state.table;
        table.favourite = !table.favourite;
        this.updateTable(table)
    }

    updateTable(table: TableModel) {
        table.last_modyfied = new Date(Date.now());
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
                this.setState({table: resp.data});
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

    render() {
        return (
            <MDBContainer>
                {this.state.table.name}
                <button type="button" className="btn btn-danger bmd-btn-fab" onClick={this.toggleFavorite}>
                    {this.favouriteButtonStar()}
                </button>
                {/*    TODO wyswietlic kazda liste*/}
            </MDBContainer>
        );
    }
}
