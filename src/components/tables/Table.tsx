import React, {Component} from 'react';
import {MDBContainer} from 'mdbreact';
import axios from 'axios';
import TableModel from "../../data-models/TableModel";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;
interface Props {
    match: any,
}
interface State {
    table: TableModel
}
export default class Table extends Component<Props,State> {


    constructor(props: Props) {
        super(props);
        this.state = {
            table: new TableModel()
        }
    }
    componentDidMount() {
        debugger;
        console.log("test")
        axios.get(`/api/table/${this.props.match.params.id}`)
            .then((resp) => {
                this.setState({table: resp.data });
                debugger;
            });
    }
    render() {
        return (
            <MDBContainer >
                {this.state.table.name}
                {/*    TODO wyswietlic kazda liste*/}
            </MDBContainer>
        );
    }
}
