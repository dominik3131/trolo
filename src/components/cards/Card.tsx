import React, {Component} from 'react';
import CardModel from "../../data-models/CardModel";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";

interface Props {
    card: CardModel
}

interface State {
    isLoading: boolean
    cards: CardModel;
    cardNameInputOpen: boolean,
    toggleCreate: boolean
}

export default class List extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            cards: this.props.card,
            cardNameInputOpen: false,
            toggleCreate: false
        };
        this.fetchCard();
    }

    fetchCard() {
        axios.get(`/api/cards/${this.props.card.id}`)
            .then((resp) => {
                this.setState({cards: resp.data, isLoading: false});
            });
    }

    view() {
        if (this.state.isLoading) {
            return <div className="card">
                <div className={"card-body"}>
                    {this.props.card.name}
                    <SmallSpinner/>
                </div>
            </div>
        }
        
        return <div className="card">
            <div className={"card-body"}>
                {this.state.cards.name}
                <button type="button" className="btn btn-primary btn-sm">
                    <i className="far fa-edit"/>
                </button>
            </div>
        </div>
    }

    render() {
        return <div>
            {this.view()}
        </div>;
    }




}