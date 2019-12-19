import React, {Component} from 'react';
import CardModel from "../../data-models/CardModel";
import axios from "axios";
import Card from "./Card";
import Spinner from "../../utils/Spinner";
import {MDBAlert} from 'mdbreact';

interface Props {
    match: any,
}

interface State {
    card: CardModel
    isLoading: boolean
    noAccess: boolean
}

export default class SharedCard extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            card: new CardModel(),
            isLoading: true,
            noAccess: false
        };

        this.fetchCard();
    }

    fetchCard() {
        axios.get(`/api/cards/${this.props.match.params.id}`)
            .then((resp) => {
                this.setState({card: resp.data, isLoading: false});
            })
            .catch(() => {
                this.setState({noAccess: true, isLoading: false})
            });
    }


    render() {
        if (this.state.isLoading) {
            return <Spinner/>
        } else if (this.state.noAccess) {
            return <MDBAlert color="danger">
                Card doesn't exist or you don't have access to it
            </MDBAlert>
        }
        return <Card card={this.state.card} afterModify={() => {
        }} modalOpened={true}/>
    };
}