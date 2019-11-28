import React, {Component} from 'react';
import CardModel from "../../data-models/CardModel";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import {
    MDBBtn, MDBCard, MDBCardBody,
    MDBCol,
    MDBContainer, MDBFormInline,
    MDBIcon, MDBInput,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader,
    MDBRow
} from "mdbreact";

interface Props {
    card: CardModel
    afterModify: any
}

interface State {
    modalOpened: boolean
    isLoading: boolean
    card: CardModel
    cardCopy: CardModel
    cardNameInputOpen: boolean
    toggleCreate: boolean
    newCardName: string
}

export default class Card extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            modalOpened: false,
            isLoading: true,
            card: this.props.card,
            cardCopy: this.props.card,
            cardNameInputOpen: false,
            toggleCreate: false,
            newCardName: ''
        };
        this.bindMethods();
        this.fetchCard();
    }

    bindMethods() {
        this.deleteCard = this.deleteCard.bind(this);
        this.toggleArchive = this.toggleArchive.bind(this);
        this.toggleNameInput = this.toggleNameInput.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.updateCardName = this.updateCardName.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.saveAndUpdateCard = this.saveAndUpdateCard.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);

    }

    fetchCard() {
        axios.get(`/api/cards/${this.props.card.id}`)
            .then((resp) => {
                this.setState({card: resp.data, isLoading: false});
            });
    }

    updateCard(card: CardModel) {
        this.setState({card: card});
        axios.put(`/api/cards/${this.state.card.id}`, card)
            .then((resp) => {
                this.setState({card: resp.data});
                this.props.afterModify();
            });
    };

    deleteCard() {
        axios.delete(`/api/cards/${this.state.card.id}`)
            .then(() => {
                this.props.afterModify();
            });
    };

    toggleNameInput() {
        this.setState({cardNameInputOpen: !this.state.cardNameInputOpen})
    }

    toggleArchive() {
        let card = this.state.card;
        card.is_archive = !card.is_archive;
        this.setState({card: card});
    }

    toggleModal() {
        if (this.state.modalOpened) {
            this.setState({modalOpened: !this.state.modalOpened})
        } else {
            this.setState({modalOpened: !this.state.modalOpened, cardCopy: {...this.state.card}})
        }
    }

    updateCardName() {
        let card = this.state.card;
        card.name = this.state.newCardName;
        this.setState({card: card});
        this.toggleNameInput();
    }


    nameChanged(e: any) {
        let name = e.target.value;
        this.setState({newCardName: name})
    }

    descriptionChanged(e: any) {
        let card = this.state.card;
        card.description = e.target.value;
        this.setState({card: card})
    }

    saveAndUpdateCard() {
        this.toggleModal();
        this.updateCard(this.state.card);
    }

    cancelEdit() {
        this.setState({card: this.state.cardCopy});
        this.toggleModal();
    }

    cardName() {
        if (this.state.cardNameInputOpen) {
            return <MDBFormInline>
                <MDBIcon far icon="credit-card"/>
                <input className="form-control" defaultValue={this.state.card.name || ''}
                       onChange={this.nameChanged}/>
                <MDBBtn color={'primary'} size={'sm'} onClick={this.updateCardName}>
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>
                <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleNameInput}>
                    <MDBIcon icon={'far fa-times-circle'}/>
                </MDBBtn>
            </MDBFormInline>
        } else {
            return <span>
                <MDBIcon far icon="credit-card"/>
                <span onClick={this.toggleNameInput}>{this.state.card.name}</span>
            </span>;
        }
    }

    cardDeleteArchive() {
        if (this.state.card.is_archive) {
            return [
                <MDBBtn color="primary" size={'sm'} onClick={this.toggleArchive}>
                    <MDBIcon far icon="trash-alt"/> Return card to table
                </MDBBtn>
                ,
                <MDBBtn color="danger" size={'sm'} onClick={this.deleteCard}>
                    <MDBIcon far icon="trash-alt"/> Delete
                </MDBBtn>]
        } else {
            return <MDBBtn color="primary" size={'sm'} onClick={this.toggleArchive}>
                <MDBIcon far icon="trash-alt"/> Archive
            </MDBBtn>
        }

    }

    cardDescription() {
        return <div>
            <MDBInput
                type="textarea"
                label="Description"
                rows="2"
                valueDefault={this.state.card.description || ''}
                onChange={this.descriptionChanged.bind(this)}
            />
        </div>
    }

    modal() {
        return <MDBContainer>
            <MDBModal size="lg" isOpen={this.state.modalOpened} toggle={this.toggleModal}>
                <MDBModalHeader toggle={this.toggleModal}>
                    {this.cardName()}
                </MDBModalHeader>
                <MDBModalBody>
                    <MDBContainer>
                        <MDBRow>
                            <MDBCol size="9">
                                {this.cardDescription()}
                            </MDBCol>
                            <MDBCol>
                                {this.cardDeleteArchive()}
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>

                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn id={'saveButton'} size={'sm'} onClick={this.saveAndUpdateCard}
                            color="primary">Save</MDBBtn>
                    <MDBBtn id={'cancelButton'} size={'sm'} onClick={this.cancelEdit}
                            color="danger">Cancel</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        </MDBContainer>
    }

    view() {
        if (this.state.isLoading) {
            return <MDBCard>
                <MDBCardBody>
                    {this.props.card.name}
                    <SmallSpinner/>
                </MDBCardBody>
            </MDBCard>
        }
        return <MDBCard>
            <MDBCardBody>
                <span onClick={this.toggleModal}>{this.state.card.name}</span>
                {this.modal()}
            </MDBCardBody>
        </MDBCard>
    }

    render() {
        return <div>
            {this.view()}
        </div>;
    }
}