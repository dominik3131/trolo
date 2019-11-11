import React, {Component} from 'react';
import {MDBContainer} from 'mdbreact';
import './Table.css';
import axios from 'axios';
import TableModel from "../../data-models/TableModel";
import Spinner from "../../utils/Spinner";
import List from "../lists/List";
import CreateList from "../lists/CreateList";
import ListModel from "../../data-models/ListModel";

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
    isLoading: boolean,
}

export default class Table extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            table: new TableModel(),
            nameInputOpen: false,
            newTableName: '',
            isLoading: true,
        };
        this.toggleNameInput = this.toggleNameInput.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.updateName = this.updateName.bind(this);

        this.fetchTable();
    }

    toggleFavorite = () => {
        let table = this.state.table;
        table.favourite = !table.favourite;
        this.updateTable(table)
    };

    updateTable(table: TableModel) {
        table.last_modyfied = new Date(Date.now());
        this.setState({table: table});
        axios.put(`/api/tables/${this.props.match.params.id}`, table)
            .then((resp) => {
                this.setState({table: resp.data});
            });
    }

    fetchTable() {
        axios.get(`/api/tables/${this.props.match.params.id}`)
            .then((resp) => {
                let table: TableModel = resp.data;
                table.last_open = new Date(Date.now());
                this.setState({table: resp.data, isLoading: false});
                axios.put(`/api/tables/${this.props.match.params.id}`, table)
                    .then();
            });
    };

    favouriteButtonStar() {
        if (this.state.table.favourite) {
            return <i className="fas fa-star"/>
        }
        return <i className="far fa-star"/>
    }

    toggleNameInput() {
        this.setState({nameInputOpen: !this.state.nameInputOpen})
    }

    listAdded(newList: ListModel) {
        let table = this.state.table;
        if (table.listy)
            table.listy.push(newList);
        this.setState({table:table});
        this.updateTable(this.state.table);
    }

    updateName() {
        let table = this.state.table;
        table.name = this.state.newTableName;
        this.updateTable(table);
        this.toggleNameInput();
    }

    nameChanged(e: any) {
        this.setState({newTableName: e.target.value})
    }

    tableName() {
        if (this.state.nameInputOpen) {
            return [
                <input className="form-control" defaultValue={this.state.table.name || ''}
                       onChange={this.nameChanged}/>,
                <button type="button" className="btn btn-primary btn-sm" onClick={this.updateName}>
                    Save
                </button>,
                <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleNameInput}>
                    Cancel
                </button>
            ]

        } else {
            return [
                <h4 className="h2-responsive stroke"><strong>{this.state.table.name}</strong></h4>,
                <button type="button" className="btn btn-success btn-sm" onClick={this.toggleNameInput}>
                    Edit Name
                </button>
            ]
        }
    }

    view() {
        if (this.state.isLoading) {
            return <Spinner/>
        }
        let imgUrl = this.state.table.background;
        let divStyle = {
            backgroundImage: 'url(' + imgUrl + ')'
        };
        let listCreator;
        if (this.state.table.id) {
            listCreator = <CreateList afterAdd={this.listAdded.bind(this)} tableId={this.state.table.id}/>
        }
        return <div style={divStyle} className={'singleTable'}>
            <MDBContainer>
                <div className={'form-inline'}>
                    {this.tableName()}
                    <button type="button" className="btn btn-danger bmd-btn-fab btn-sm" onClick={this.toggleFavorite}>
                        {this.favouriteButtonStar()}
                    </button>
                    {listCreator}
                </div>

                {this.renderLists()}

            </MDBContainer>
        </div>

    }

    renderLists() {
        const items: any[] = [];
        if (this.state.table.listy) {
            this.state.table.listy.forEach(list => {
                        items.push(<List list={list}/>);
                }
            )
        }
        return (
            <div className={'row'}>
                {items}
            </div>
        )
    }

    render() {
        return (
            this.view()
        );
    }
}
