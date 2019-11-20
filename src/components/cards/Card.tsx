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
    toggleDeleteCard: boolean
    newCardName: string
}

export default class List extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            modalOpened: false,
            isLoading: true,
            card: this.props.card,
            cardCopy: this.props.card,
            cardNameInputOpen: false,
            toggleCreate: false,
            toggleDeleteCard: false,
            newCardName: ''
        };
        this.bindMethods();
        this.fetchCard();
    }

    bindMethods(){
        this.toggleNameInput = this.toggleNameInput.bind(this);
        this.toggleNameDeleteCard = this.toggleNameDeleteCard.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.updateCardName = this.updateCardName.bind(this);
        this.updateCardsToDelete = this.updateCardsToDelete.bind(this);
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

    toggleNameInput() {
        this.setState({cardNameInputOpen: !this.state.cardNameInputOpen})
    }

    toggleNameDeleteCard() {
        this.setState({toggleDeleteCard: !this.state.toggleDeleteCard})
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
    updateCardsToDelete() {
        this.deleteCard(this.state.card);
        this.toggleNameDeleteCard();
    }

    updateCard(card: CardModel) {
        this.setState({card: card});
        axios.put(`/api/cards/${this.state.card.id}`, card)
            .then((resp) => {
                this.setState({card: resp.data});
                this.props.afterModify();
            });
    };

    deleteCard(card: CardModel) {
        this.setState({card: card});
        axios.delete(`/api/cards/${this.state.card.id}`)
            .then(() => {
                this.props.afterModify();
            });
    };

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
                    <MDBIcon  icon={'fas fa-check'}/>
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

    cardDelete() {
        return <MDBBtn color="danger" onClick={this.updateCardsToDelete}>
            <MDBIcon far icon="trash-alt"/> Delete
        </MDBBtn>
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
            <MDBBtn size="sm" onClick={this.toggleModal}><MDBIcon icon="edit"/></MDBBtn>
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
                                {this.cardDelete()}
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>

                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn id={'saveButton'} onClick={this.saveAndUpdateCard}
                            color="primary">Save</MDBBtn>
                    <MDBBtn id={'cancelButton'} onClick={this.cancelEdit}
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
                {this.state.card.name}
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