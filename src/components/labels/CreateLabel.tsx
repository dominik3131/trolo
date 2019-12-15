import React, {Component} from 'react';
import axios from 'axios';
import LabelModel from "../../data-models/LabelModel";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    cardId: number
    afterAdd: any
    toggleCreator: any
}

interface State {
    labelName: string
    labelColor: string
}

export default class CreateLabel extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            labelName: '',
            labelColor: '',
        };
        this.toggleLabelNameInput = this.toggleLabelNameInput.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.createLabel = this.createLabel.bind(this);
    }

    createLabel() {
        let label = new LabelModel();
        label.name = this.state.labelName;
        label.id_table = this.props.cardId;
        this.toggleLabelNameInput();
        axios.post('/api/labels/', label).then(
            (resp) => {
                this.props.afterAdd(resp.data)
            }
        );
    }

    toggleLabelNameInput() {
        this.props.toggleCreator();
    }

    nameChanged(e: any) {
        this.setState({labelName: e.target.value});
    }

    render() {
        return [
            <input className="form-control" defaultValue={this.state.labelName}
                   onChange={this.nameChanged}/>,
            <input className="form-control" defaultValue={this.state.labelColor}
                   onChange={this.nameChanged}/>,
            <div>
                <button type="button" className="btn btn-success btn-sm" onClick={this.createLabel}>
                    <i className="fas fa-check"/>
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleLabelNameInput}>
                    <i className="far fa-times-circle"/>
                </button>
            </div>]
    }
}
