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
    tableId: number | undefined
}

export default class SharedCard extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            card: new CardModel(),
            isLoading: true,
            noAccess: false,
            tableId: undefined
        };
        this.fetchCard();
    }

    fetchCard() {
        axios.get(`/api/cards/${this.props.match.params.id}`)
            .then((resp) => {
                this.setState({card: resp.data});
                this.fetchList(resp.data.id_list);
            })
            .catch(() => {
                this.setState({noAccess: true, isLoading: false})
            });
    }

    fetchList(id:number) {
        axios.get(`/api/lists/${id}`, {
            headers: {
                'Authorization': 'token' + localStorage.getItem('user_token')
            }
        })
            .then((resp) => {
                this.setState({tableId: resp.data.id_table, isLoading: false});
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
        return <Card afterAdd={()=>{}} tableId={this.state.tableId as number} shareToggleBlocked={true} card={this.state.card} afterModify={() => {
        }} modalOpened={true}/>
    };
}