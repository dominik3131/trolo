import React, {Component} from 'react';
import CardModel from "../../data-models/CardModel";
import Comment from "../comments/Comment";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import {
    MDBBtn, MDBBtnGroup, MDBCard, MDBCardBody,
    MDBCol,
    MDBContainer, MDBFormInline,
    MDBIcon, MDBInput,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader, MDBPopover, MDBPopoverBody, MDBPopoverHeader,
    MDBRow
} from "mdbreact";
import Attachments from "../Attachments/Attachments";
import CommentsList from "../comments/CommentsList";
import AttachmentInput from "../Attachments/AttachmentInput";

interface Props {
    card: CardModel
    afterModify: any
    modalOpened?: boolean
    shareToggleBlocked?: boolean
}

interface State {
    modalOpened: boolean
    isLoading: boolean
    card: CardModel
    cardCopy: CardModel
    cardNameInputOpen: boolean
    toggleCreate: boolean
    newCardName: string
    newAttachmentAdded: boolean
}

export default class Card extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            modalOpened: this.props.modalOpened ? this.props.modalOpened : false,
            isLoading: true,
            card: this.props.card,
            cardCopy: this.props.card,
            cardNameInputOpen: false,
            toggleCreate: false,
            newCardName: '',
            newAttachmentAdded: false
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
        this.attachmentAdded = this.attachmentAdded.bind(this);
        this.unarchiveCard = this.unarchiveCard.bind(this);
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

    commentDeleted() {
        this.updateCard(this.state.card);
    }

    toggleNameInput() {
        this.setState({cardNameInputOpen: !this.state.cardNameInputOpen})
    }

    toggleArchive() {
        let card = this.state.card;
        card.is_archive = !card.is_archive;
        this.setState({card: card});
    }

    unarchiveCard() {
        let card = this.state.card;
        card.is_archive = false;
        this.updateCard(card);
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

    attachmentAdded() {
        this.setState({newAttachmentAdded: true});
    }

    commentAdded() {
        this.updateCard(this.state.card);
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
            return <MDBBtnGroup size="sm">
                <MDBBtn color="primary" size={'sm'} onClick={this.toggleArchive}>
                    <MDBIcon far icon="trash-alt"/> Return card to table
                </MDBBtn>
                <MDBBtn color="danger" size={'sm'} onClick={this.deleteCard}>
                    <MDBIcon far icon="trash-alt"/> Delete
                </MDBBtn>
            </MDBBtnGroup>

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

    attachments() {
        if (this.state.newAttachmentAdded) {
            //workaround for passing new attachment event to Attachments
            this.setState({newAttachmentAdded: false})
        } else {
            return <Attachments cardId={this.state.card.id as number}
                                afterModify={this.props.afterModify}/>
        }
    }

    modal() {
        return <MDBContainer>
            <MDBModal size="fluid" isOpen={this.state.modalOpened} toggle={this.toggleModal}>
                <MDBModalHeader toggle={this.toggleModal}>
                    {this.cardName()}
                </MDBModalHeader>
                <MDBModalBody>
                    <MDBContainer>
                        <MDBRow>
                            <MDBCol sm={"12"} md={"9"}>
                                {this.cardDescription()}
                                {this.attachments()}
                                <CommentsList cardId={this.state.card.id} afterModify={this.props.afterModify}/>
                            </MDBCol>
                            <MDBCol sm={"12"} md={"3"}>
                                {this.cardDeleteArchive()}
                                <AttachmentInput cardId={this.state.card.id} afterAdd={this.attachmentAdded}
                                                 size={'lg'}/>
                                {this.shareCard()}
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

    getCardLink() {
        let link = window.location.hostname;
        if (window.location.port) {
            link = link.concat(':', window.location.port)
        }
        let id = this.state.card.id as number;
        link = link.concat('/card/', id.toString());
        return link;
    }

    handleShareToggle = () => {
        if(!this.props.shareToggleBlocked){
            let card = this.state.card;
            card.is_shared = !card.is_shared;
            this.setState({card: card});
            this.updateCard(card);
        }
    };

    shareCard() {
        return <MDBPopover placement="top" popover clickable id="popper1">
            <MDBBtn size={'sm'} color={'primary'}>
                <MDBIcon icon="share-alt"/> Share
            </MDBBtn>
            <div>
                <MDBPopoverHeader>Link to this card</MDBPopoverHeader>
                <MDBPopoverBody>
                    <div className='custom-control custom-switch'>
                        <input
                            type='checkbox'
                            className='custom-control-input'
                            id='customSwitches'
                            readOnly
                            checked={this.state.card.is_shared}
                            onChange={this.handleShareToggle}
                        />
                        <label className='custom-control-label' htmlFor='customSwitches'>
                            Toggle sharing
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="formGroupExampleInput">Default input</label>
                        <input
                            type="text"
                            className="form-control"
                            id="formGroupExampleInput"
                            value={this.getCardLink()}
                        />
                    </div>
                </MDBPopoverBody>
            </div>
        </MDBPopover>
    }

    view() {
        if (this.state.isLoading) {
            return <MDBCard>
                <MDBCardBody>
                    {this.props.card.name}
                    <SmallSpinner/>
                </MDBCardBody>
            </MDBCard>
        } else if (this.state.card.is_archive) {
            return <MDBCard>
                <MDBCardBody>
                    <div className={'form-inline'}>
                        {this.state.card.name}
                        <MDBBtnGroup size="sm">
                            <MDBBtn color={'success'} size={'sm'} onClick={this.unarchiveCard}>
                                <MDBIcon icon="undo"/>
                            </MDBBtn>
                            <MDBBtn color={'danger'} size={'sm'} onClick={this.deleteCard}>
                                <MDBIcon icon="trash-alt"/>
                            </MDBBtn>
                        </MDBBtnGroup>
                    </div>
                </MDBCardBody>
            </MDBCard>
        }
        return <MDBCard onClick={this.toggleModal}>
            <MDBCardBody>
                {this.state.card.name}
            </MDBCardBody>
        </MDBCard>
    }

    renderComments() {
        const items: any[] = [];
        if (this.state.card.comments) {
            this.state.card.comments
                .forEach(comment => {
                        items.push(<Comment afterModify={this.commentDeleted.bind(this)} key={comment.id}
                                            comment={comment}/>);
                    }
                )
        }
        return items
    }

    render() {
        return <div>
            {this.view()}
            {this.modal()}
        </div>;
    }
}