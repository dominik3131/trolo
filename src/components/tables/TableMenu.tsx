import React, {Component} from 'react';
import './Table.css';
import axios from 'axios';
import TableModel from "../../data-models/TableModel";
import {MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon} from "mdbreact";
import Card from "../cards/Card";
import CardModel from "../../data-models/CardModel";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    table: TableModel;
    afterModify: any;
}

interface State {
    table: TableModel
    modalOpened: boolean;
}

export default class TableMenu extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            table: new TableModel(),
            modalOpened: false
        };
        this.bindMethods();
    }

    bindMethods() {
        this.toggleModal = this.toggleModal.bind(this);
        this.cardOrListEdited = this.cardOrListEdited.bind(this);
    }

    toggleFavorite = () => {
        let table = this.state.table;
        table.favourite = !table.favourite;
        this.updateTable(table)
    };

    updateTable(table: TableModel) {
        table.last_modyfied = new Date(Date.now());
        this.setState({table: table});
        axios.put(`/api/tables/${this.props.table.id}`, table)
            .then((resp) => {
                this.setState({table: resp.data});
            });
    }

    fetchTable() {
        axios.get(`/api/tables/${this.props.table.id}`)
            .then((resp) => {
                let table: TableModel = resp.data;
                this.setState({table: table})
            });
    };

    toggleModal() {
        if (!this.state.modalOpened) {
            this.fetchTable();
        }
        this.setState({modalOpened: !this.state.modalOpened});
    }

    cardOrListEdited() {
        this.fetchTable();
        this.props.afterModify();
    }

    view() {
        return <div>
            <MDBBtn size={"sm"} color="info" onClick={this.toggleModal}><MDBIcon icon="bars"/></MDBBtn>
            <MDBModal isOpen={this.state.modalOpened} toggle={this.toggleModal} fullHeight position="right">
                <MDBModalHeader toggle={this.toggleModal}>{this.state.table.name}</MDBModalHeader>
                <MDBModalBody>
                    {this.showArchivedCards()}
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={this.toggleModal}>Close</MDBBtn>
                    <MDBBtn color="primary">Save changes</MDBBtn>
                </MDBModalFooter>
            </MDBModal></div>;
    }

    showArchivedCards() {
        let archivedCards: CardModel[] = [];
        if (this.state.table.listy) {
            this.state.table.listy.forEach(
                (list) => {
                    if (list.cards) {
                        archivedCards.push(...list.cards.filter(card => card.is_archive))
                    }
                }
            )
        }
        let cards: JSX.Element[] = [];
        archivedCards.forEach(
            card => cards.push(<Card tableId={this.state.table.id as number} key={card.id} card={card} afterModify={this.cardOrListEdited} afterAdd={this.cardOrListEdited}/>)
        );
        return <div>{cards}</div>
    }

    render() {
        return this.view();
    }

}
