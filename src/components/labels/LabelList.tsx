import React, {Component} from 'react';
import axios from 'axios';
import LabelModel from "../../data-models/LabelModel";
import Label from "./Label";
import {MDBFormInline} from "mdbreact";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    labels: LabelModel[]
}

interface State {
}

export default class LabelList extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    renderLabels() {
        let labels: any[] = [];
        this.props.labels
            .forEach(label => labels.push(<Label label={label} key={label.id}/>));
        return <MDBFormInline>{labels}</MDBFormInline>
    }

    render() {
        return this.renderLabels();
    }
}