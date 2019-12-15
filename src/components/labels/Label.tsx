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
    newLabelColor: string
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
            newLabelName: '',
            newLabelColor: ''
        };
        this.bindMethods();
    }

    bindMethods() {

    }

    fetchComments() {
        console.log("pobrane");
        axios.get(`/api/labels/${this.props.label.id}`)
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
    labelColorChanged(e: any) {
        let color = e.target.value;
        this.setState({newLabelColor: color})
    }

    toggleLabelNameInput() {
        this.setState({labelNameInputOpen: !this.state.labelNameInputOpen})
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