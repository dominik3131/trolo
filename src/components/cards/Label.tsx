import React, {Component} from 'react';
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import { MDBBadge, MDBCard, MDBCardBody, MDBRow } from "mdbreact";
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
}

export default class Label extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            label: this.props.label,
            name: this.props.label.name,
            color: this.props.label.color
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

    commentChanged() {
        this.props.afterModify();
        this.fetchComments();
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