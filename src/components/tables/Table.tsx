import React, {Component} from 'react';
import './Table.css';
import axios from 'axios';
import TableModel from "../../data-models/TableModel";
import Spinner from "../../utils/Spinner";
import List from "../lists/List";
import CreateList from "../lists/CreateList";
import ListModel from "../../data-models/ListModel";
import {MDBBtn, MDBContainer, MDBFormInline, MDBIcon} from "mdbreact";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    match: any,
}

interface State {
    table: TableModel
    nameInputOpen: boolean
    toggleOpenBackground: boolean
    toogleOpenDescription: boolean
    toogleOpenCloseTable: boolean
    newTableName: string
    newBackground: string
    newDescription: string
    isLoading: boolean,
}

export default class Table extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            table: new TableModel(),
            nameInputOpen: false,
            toggleOpenBackground: false,
            toogleOpenDescription: false,
            toogleOpenCloseTable: false,
            newTableName: '',
            newBackground: '',
            newDescription: '',
            isLoading: true,
        };

        this.toggleNameInput = this.toggleNameInput.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateBackground = this.updateBackground.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.toggleBackground = this.toggleBackground.bind(this);
        this.backgroundChanged = this.backgroundChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.toggleDescription = this.toggleDescription.bind(this);
        this.toggleCloseTable = this.toggleCloseTable.bind(this);
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
            return <MDBIcon icon={'fas fa-star'}/>
        }
        return <MDBIcon icon={'far fa-star'}/>
    }

    toggleDescription() {
        this.setState({toogleOpenDescription: !this.state.toogleOpenDescription})
    }

    toggleCloseTable() {
        this.setState({toogleOpenCloseTable: !this.state.toogleOpenCloseTable})
    }

    toggleBackground() {
        this.setState({toggleOpenBackground: !this.state.toggleOpenBackground})
    }

    toggleNameInput() {
        this.setState({nameInputOpen: !this.state.nameInputOpen})
    }

    listAdded(newList: ListModel) {
        let table = this.state.table;
        if (table.listy)
            table.listy.push(newList);
        this.setState({table: table});
        this.updateTable(this.state.table);
    }

    listModified() {
        this.updateTable(this.state.table);
    }

    updateName() {
        let table = this.state.table;
        table.name = this.state.newTableName;
        this.updateTable(table);
        this.toggleNameInput();
    }

    updateBackground() {
        let table = this.state.table;
        table.background = this.state.newBackground;
        this.updateTable(table);
        this.toggleBackground();
    }

    updateDescription() {
        let table = this.state.table;
        console.log(this.state.newDescription)
        table.description = this.state.newDescription;
        this.updateTable(table);
        this.toggleDescription();
    }

    nameChanged(e: any) {
        this.setState({newTableName: e.target.value})
    }

    backgroundChanged(e: any) {
        this.setState({newBackground: e.target.value})
    }

    descriptionChanged(e: any) {
        this.setState({newDescription: e.target.value})
    }

    tableClose() {
        if (this.state.toogleOpenCloseTable) {
            console.log("witamy123")
            return [
                <MDBBtn color={'default'} size={'sm'} >
                    Close this table?
                </MDBBtn>,
                <MDBBtn color={'success'} size={'sm'} >
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>,
                <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleCloseTable}>
                    <MDBIcon icon={'far fa-times-circle'}/>
                </MDBBtn>
            ]

        } else {
            return [
                <MDBBtn key={'button'} color={'success'} size={'sm'} onClick={this.toggleCloseTable}>
                    Close Table
                </MDBBtn>
            ]        }
    }

    tableDescription() {
        if (this.state.toogleOpenDescription) {
            return [
                <input className="form-control" defaultValue={this.state.table.description || ''}
                       onChange={this.descriptionChanged}/>,
                <MDBBtn color={'success'} size={'sm'} onClick={this.updateDescription}>
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>,
                <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleDescription}>
                    <MDBIcon icon={'far fa-times-circle'}/>
                </MDBBtn>
            ]

        } else {
            return [
                <MDBBtn key={'button'} color={'success'} size={'sm'} onClick={this.toggleDescription}>
                    Edit Table Description
                </MDBBtn>
            ]        }
    }

    tableBackground() {
        if (this.state.toggleOpenBackground) {
            return [
                <input className="form-control" defaultValue={this.state.table.background || ''}
                       onChange={this.backgroundChanged}/>,
                <MDBBtn color={'success'} size={'sm'} onClick={this.updateBackground}>
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>,
                <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleBackground}>
                    <MDBIcon icon={'far fa-times-circle'}/>
                </MDBBtn>
            ]

        } else {
            return [
                <MDBBtn key={'button'} color={'success'} size={'sm'} onClick={this.toggleBackground}>
                    Edit table background
                </MDBBtn>
            ]        }
    }



    tableName() {
        if (this.state.nameInputOpen) {
            return [
                <input className="form-control" defaultValue={this.state.table.name || ''}
                       onChange={this.nameChanged}/>,
                <MDBBtn color={'success'} size={'sm'} onClick={this.updateName}>
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>,
                <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleNameInput}>
                    <MDBIcon icon={'far fa-times-circle'}/>
                </MDBBtn>
            ]

        } else {
            return [
                <h4 key={'header'} className="h2-responsive stroke">{this.state.table.name}</h4>,
                <MDBBtn key={'button'} color={'success'} size={'sm'} onClick={this.toggleNameInput}>
                    <MDBIcon icon={'far fa-edit'}/>
                </MDBBtn>
            ]
        }
    }

    view() {
        if (this.state.isLoading) {
            return <Spinner/>
        }
        let imgUrl = this.state.table.background;
        let divStyle = {
            backgroundImage: 'url(' + imgUrl + ')',
            backgroundAttachment: "scroll"
        };
        let listCreator;
        if (this.state.table.id) {
            listCreator = <CreateList afterAdd={this.listAdded.bind(this)} tableId={this.state.table.id}/>
        }
        return <div style={divStyle} className={'singleTable'}>
            <MDBContainer fluid>
                <MDBFormInline>
                    {this.tableName()}
                    <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleFavorite}>
                        {this.favouriteButtonStar()}
                    </MDBBtn>
                    {listCreator}
                    {this.tableDescription()}
                    {this.tableBackground()}
                    {this.tableClose()}
                </MDBFormInline>
                {this.renderLists()}
            </MDBContainer>
        </div>

    }

    renderLists() {
        const items: any[] = [];
        if (this.state.table.listy) {
            this.state.table.listy
                .filter(list => !list.is_archive)
                .forEach(list => {
                        items.push(<List key={list.id} afterModify={this.listModified.bind(this)} list={list}/>);
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
