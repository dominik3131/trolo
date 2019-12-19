import React, {Component} from 'react';
import CardModel from "../../data-models/CardModel";
import LabelModel from "../../data-models/LabelModel";
import axios from "axios";
import {MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle} from "mdbreact";
import Label from "../labels/Label";

interface Props {
    tableId:number;
    card:CardModel;
    addLabel:any
}

interface State {
    tableLabels:LabelModel[];
}

export default class CardLabelAdder extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            tableLabels:[]
        };
        this.fetchLabels();
        this.addLabel=this.addLabel.bind(this);
    }
    fetchLabels(){
        axios.get(`/api/tables/labels/${this.props.tableId}`)
            .then((resp) => {
                this.setState({tableLabels: resp.data});
            });
    }
    addLabel(label:LabelModel){
        this.props.addLabel(label);
        console.log(label)
    }
    renderLabels(){
        let labels: any[] = [];
        this.state.tableLabels
            .forEach(label=>{
                labels.push(<MDBDropdownItem key={label.id} onClick={()=>{this.addLabel(label)}}>
                    <Label label={label}/>
                </MDBDropdownItem>)
            });
        return labels
    }
    dropdown() {
        return <MDBDropdown dropright size={'sm'}>
            <MDBDropdownToggle caret color="primary">
                Add label to card
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
                {this.renderLabels()}
            </MDBDropdownMenu>
        </MDBDropdown>
    }

    render() {
        return this.dropdown();
    }
}