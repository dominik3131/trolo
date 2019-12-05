import React, {Component} from 'react';
import './Table.css';
import axios from 'axios';
import TableModel from "../../data-models/TableModel";
import Spinner from "../../utils/Spinner";
import List from "../lists/List";
import CreateList from "../lists/CreateList";
import ListModel from "../../data-models/ListModel";
import {
    MDBBtn,
    MDBContainer,
    MDBFormInline,
    MDBIcon,
    MDBInput,
    MDBPopover,
    MDBPopoverBody,
    MDBBtnGroup
} from "mdbreact";
import TableMenu from "./TableMenu";

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
    toggleOpenDescription: boolean
    toggleOpenCloseTable: boolean
    newTableName: string
    newBackground: string
    newDescription: string
    is_closed: boolean
    isLoading: boolean,
}

export default class Table extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            table: new TableModel(),
            nameInputOpen: false,
            toggleOpenBackground: false,
            toggleOpenDescription: false,
            toggleOpenCloseTable: false,
            newTableName: '',
            newBackground: '',
            newDescription: '',
            is_closed: false,
            isLoading: true,
        };

        this.nameChanged = this.nameChanged.bind(this);
        this.backgroundChanged = this.backgroundChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);

        this.updateName = this.updateName.bind(this);
        this.updateBackground = this.updateBackground.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.updateCloseTable = this.updateCloseTable.bind(this);

        this.toggleNameInput = this.toggleNameInput.bind(this);
        this.toggleBackground = this.toggleBackground.bind(this);
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
            return <MDBIcon icon="star"/>
        }
        return <MDBIcon far icon="star"/>
    }

    toggleDescription() {
        this.setState({
            toggleOpenDescription: !this.state.toggleOpenDescription,
            newDescription: this.state.table.description as string
        })
    }

    toggleCloseTable() {
        this.setState({toggleOpenCloseTable: !this.state.toggleOpenCloseTable})
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
        table.description = this.state.newDescription;
        this.updateTable(table);
        this.toggleDescription();
    }

    updateCloseTable() {
        let table = this.state.table;
        table.is_closed = true;
        this.updateTable(table);
        this.toggleCloseTable();
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
        if (this.state.toggleOpenCloseTable) {
            return [
                "Close this table?",
                <MDBBtnGroup size="sm">
                    <MDBBtn color={'success'} size={'sm'} onClick={this.updateCloseTable}>
                        <MDBIcon icon={'fas fa-check'}/>
                    </MDBBtn>
                    <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleCloseTable}>
                        <MDBIcon icon={'far fa-times-circle'}/>
                    </MDBBtn>
                </MDBBtnGroup>
            ]

        } else {
            return [
                <MDBBtn key={'button'} color={'success'} size={'sm'} onClick={this.toggleCloseTable}>
                    Close Table
                </MDBBtn>
            ]
        }
    }

    tableDescriptionPopover() {
        return <MDBPopover placement="bottom" popover clickable id="popper3"
        >
            <MDBBtn key={'button'} color={'success'} size={'sm'}>
                Table description
            </MDBBtn>
            <div>
                <MDBPopoverBody>
                    {this.tableDescription()}
                </MDBPopoverBody>
            </div>
        </MDBPopover>

    }

    tableDescription() {
        if (this.state.toggleOpenDescription) {
            return [
                <MDBInput
                    type="textarea"
                    rows="2"
                    label="Write description"
                    value={this.state.newDescription}
                    onChange={this.descriptionChanged}
                    key={'input'}
                />,
                <MDBBtnGroup size="sm">
                    <MDBBtn color={'success'} size={'sm'} onClick={this.updateDescription}>
                        <MDBIcon icon={'fas fa-check'}/>
                    </MDBBtn>
                    <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleDescription}>
                        <MDBIcon icon={'far fa-times-circle'}/>
                    </MDBBtn>
                </MDBBtnGroup>
            ]

        } else {
            return <div className={"popover"} onClick={this.toggleDescription}>{this.state.table.description}</div>
        }
    }

    tableBackground() {
        if (this.state.toggleOpenBackground) {
            return <div className={'form-inline'}>
                <input className="form-control" defaultValue={this.state.table.background || ''}
                       onChange={this.backgroundChanged}/>,
                <MDBBtnGroup size="sm">
                    <MDBBtn color={'success'} size={'sm'} onClick={this.updateBackground}>
                        <MDBIcon icon={'fas fa-check'}/>
                    </MDBBtn>
                    <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleBackground}>
                        <MDBIcon icon={'far fa-times-circle'}/>
                    </MDBBtn>
                </MDBBtnGroup>
            </div>

        } else {
            return [
                <MDBBtn key={'button'} color={'success'} size={'sm'} onClick={this.toggleBackground}>
                    Table background
                </MDBBtn>
            ]
        }
    }


    tableName() {
        if (this.state.nameInputOpen) {
            return [
                <input className="form-control" defaultValue={this.state.table.name || ''}
                       onChange={this.nameChanged}/>,
                <MDBBtnGroup size="sm">
                    <MDBBtn color={'success'} size={'sm'} onClick={this.updateName}>
                        <MDBIcon icon={'fas fa-check'}/>
                    </MDBBtn>
                    <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleNameInput}>
                        <MDBIcon icon={'far fa-times-circle'}/>
                    </MDBBtn>
                </MDBBtnGroup>
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
                    {this.tableDescriptionPopover()}
                    {this.tableBackground()}
                    {this.tableClose()}
                    <TableMenu table={this.state.table} afterModify={this.listModified.bind(this)}/>
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
        return this.view();
    }
}
