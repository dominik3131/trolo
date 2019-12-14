import React, {Component} from 'react';
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import { MDBFormInline,MDBIcon,MDBBtn, MDBBadge, MDBCard, MDBCardBody, MDBRow } from "mdbreact";
import LabelModel from '../../data-models/LabelModel';

interface Props {
    label: LabelModel
    afterModify: any
}

interface State {
    isLoading: boolean
    label: LabelModel
    name: string | undefined
    color: string | undefined
    labelNameInputOpen: boolean
    newLabelName: string
}

export default class Label extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            label: this.props.label,
            name: this.props.label.name,
            color: this.props.label.color,
            labelNameInputOpen: false,
            newLabelName: ''
        };
        this.bindMethods();
    }

    bindMethods() {

    }

    fetchComments() {
        axios.get(`/api/cards/labels/${this.props.label.id}`)
            .then((resp) => {
                this.setState({label: resp.data, isLoading: false});
            });
    }

    updateLabelName() {
        let label = this.state.label;
        label.name = this.state.newLabelName;
        this.setState({label: label});
        this.toggleLabelNameInput();
    }

    commentChanged() {
        this.props.afterModify();
        this.fetchComments();
    }

    labelNameChanged(e: any) {
        let name = e.target.value;
        this.setState({newLabelName: name})
    }

    toggleLabelNameInput() {
        this.setState({labelNameInputOpen: !this.state.labelNameInputOpen})
    }

    labelName() {
        if (this.state.labelNameInputOpen) {
            return <MDBFormInline>
                <MDBIcon far icon="credit-card"/>
                <input className="form-control" defaultValue={this.state.label.name || ''}
                       onChange={this.labelNameChanged}/>
                <MDBBtn color={'primary'} size={'sm'} onClick={this.updateLabelName}>
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>
                <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleLabelNameInput}>
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

    view() {
        if (this.state.isLoading) {
            return <MDBBadge>
                <SmallSpinner/>
            </MDBBadge>
        }
        return <MDBBadge color={this.state.color}>
                {this.state.name}
            </MDBBadge>
    }

    render() {
        return this.view();
    }
}