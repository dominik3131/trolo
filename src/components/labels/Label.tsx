import React, {Component} from 'react';
import LabelModel from '../../data-models/LabelModel';

interface Props {
    label: LabelModel
}

interface State {
}

export default class Label extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let divStyle = {
            backgroundColor: this.props.label.color,
            minHeight:20,
            maxHeight:20,
            minWidth:60,
            fontSize:10,
            borderRadius:3,
            margin:3
        };
        return <div style={divStyle}>
            {this.props.label.name}
        </div>
    }
}