import React, {Component} from 'react';
import axios from 'axios';
import LabelModel from "../../data-models/LabelModel";
import {MDBBtn, MDBBtnGroup, MDBFormInline, MDBIcon} from "mdbreact";
import {CirclePicker} from 'react-color';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    cardId: number
    afterAdd: any
}

interface State {
    labelName: string
    labelColor: string
    creatorOpened: boolean
}

export default class CreateLabel extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            labelName: '',
            labelColor: '',
            creatorOpened: false
        };
        this.toggleLabelNameInput = this.toggleLabelNameInput.bind(this);
        this.toggleCreator = this.toggleCreator.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.createLabel = this.createLabel.bind(this);
    }

    createLabel() {
        let label = new LabelModel();
        label.name = this.state.labelName;
        label.id_table = 6;
        //TODO TABLE ID
        label.color = this.state.labelColor;
        this.toggleLabelNameInput();
        axios.post('/api/labels', label).then(
            (resp) => {
                this.props.afterAdd(resp.data)
            }
        );
    }

    toggleLabelNameInput() {
        this.toggleCreator();
    }

    nameChanged(e: any) {
        this.setState({labelName: e.target.value});
    }

    toggleCreator() {
        this.setState({creatorOpened: !this.state.creatorOpened})
    }

    // @ts-ignore
    handleChangeComplete = (color) => {
        this.setState({labelColor: color.hex});
    };

    render() {
        if (!this.state.creatorOpened) {
            return <MDBBtn id={'saveButton'} size={'sm'} onClick={this.toggleCreator}
                           color="primary">Create new label</MDBBtn>
        }
        return <div>
            <MDBFormInline>
                <CirclePicker
                    color={this.state.labelColor}
                    onChangeComplete={this.handleChangeComplete}
                />
                <div style={{padding: 10}}>
                    Label Name
                    <br/>
                    <input className="form-control" defaultValue={this.state.labelName}
                           onChange={this.nameChanged}/>
                    <br/>
                    <MDBBtnGroup size={'sm'}>
                        <MDBBtn color={'success'} onClick={this.createLabel}>
                            <MDBIcon icon="check"/>
                        </MDBBtn>
                        <MDBBtn color={'danger'} onClick={this.toggleLabelNameInput}>
                            <MDBIcon far icon="times-circle"/>
                        </MDBBtn>
                    </MDBBtnGroup>
                </div>

            </MDBFormInline>

        </div>
    }
}
