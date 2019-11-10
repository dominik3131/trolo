import React, {Component} from 'react';
import {MDBContainer} from 'mdbreact';
import './Table.css';
import axios from 'axios';
import TableModel from "../../data-models/TableModel";
import Spinner from "../../utils/Spinner";
import Card from "react-bootstrap/Card";
import ListModel from '../../data-models/ListModel';
import { valueToNode } from '@babel/types';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    match: any,
}

interface State {
    table: TableModel
    nameInputOpen: boolean
    nameInputOpenList: boolean
    newTableName: string
    isLoading: boolean,
    listy: ListModel[]
}

export default class Table extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            table: new TableModel(),
            nameInputOpen: false,
            nameInputOpenList: false,
            newTableName: '',
            isLoading: true,
            listy: []
        }
        this.toggleNameInput = this.toggleNameInput.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.updateName = this.updateName.bind(this);

        this.toggleNameInputList = this.toggleNameInputList.bind(this);
        this.nameChangedLists = this.nameChangedLists.bind(this);
        this.updateListName = this.updateListName.bind(this);

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
                <h4 className="h2-responsive stroke"><strong>{this.state.table.name}</strong></h4>,
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
        let imgUrl = this.state.table.background;
        let divStyle = {
            backgroundImage: 'url(' + imgUrl + ')'
        }
        return <div style={divStyle } className={'singleTable'}>
            <MDBContainer  className={'form-inline'}>
                {this.tableName()}
                
                <button type="button" className="btn btn-danger bmd-btn-fab" onClick={this.toggleFavorite}>
                    {this.favouriteButtonStar()}
                </button>
                <div>
                    <div className="divstyle">
                    witam1234
                        <table>
                            <td>
                                {this.renderLists(this.state.table)}
                            </td>
                            <td><button type="button" className="btn btn-primary"> Add list</button></td>
                        </table>
                    </div>
                    {/* Pa  TODO wyswietlic kazda liste*/}
                </div>
            </MDBContainer>
        </div>
        
    }

//=========================================================================================================================================

    renderLists(table: TableModel) {
        const elements = this.state.table.listy;
        const items = [];
        if(elements != undefined)
        {
            for (const value of elements) {
                items.push(<Card>
                    <Card.Body>
                        <tr>
                            <td>{value.name}</td>
                        </tr>
                        <tr>
                            <td><button type="button" className="btn btn-primary"> Add Card</button></td>
                            <td>{this.ListName(value)}</td>
                            <td><button type="button" className="btn btn-primary"> Delete Card</button></td>
                    </tr></Card.Body></Card>)
              }
        }        
        return (
          <div>
            {items}
          </div>
          
        )
    }

    toggleNameInputList() {
        this.setState({nameInputOpenList: !this.state.nameInputOpenList})
    }


    updateListName() {
        if(this.state.table.listy != undefined)
        {
            this.updateList(this.state.table.listy);
        }
        this.toggleNameInputList();
    }

    nameChangedLists(e: any) {
        let table = this.state.table;
        if(table.listy != undefined)
        {
            for (const value of table.listy) 
            {
                if(e == value.name)
                {
                    value.name = e.target.value;
                } 
            }
        }
        this.setState({table: table})
    }

    ListName(listy: ListModel) {
        if(this.state.table.listy != undefined)
            for (const value of this.state.table.listy) {
                if(value == listy)
                {
                    if (this.state.nameInputOpenList) {
                        return [
                            <input className="form-control" defaultValue={value.name || ''}
                                   onChange={this.nameChangedLists}></input>,
                            <button type="button" className="btn btn-primary" onClick={this.updateListName}>
                                Save
                            </button>,
                            <button type="button" className="btn btn-danger" onClick={this.toggleNameInputList}>
                                Cancel
                            </button>
                        ]
            
                    } else {
                        return [
                            <button type="button" className="btn btn-primary" onClick={this.toggleNameInputList}>
                                Edit NameE
                            </button>
                        ]
                    }
                }
            
    }
    }

    updateList(listy: ListModel[]) {
        this.setState({listy: listy});
        axios.put(`/api/lists/${this.props.match.params}`, listy)
            .then((resp) => {
                this.setState({listy: resp.data});
            });
    }


    render() {
        return (
            this.view()
        );
    }
}
