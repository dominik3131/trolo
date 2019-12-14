import React, {Component} from 'react';
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import { MDBCard, MDBCardBody, MDBRow } from "mdbreact";
import ActivityModel from '../../data-models/ActivityModel';

interface Props {
    activity: ActivityModel
    afterModify: any
}

interface State {
    isLoading: boolean
    activity: ActivityModel
}

export default class Activity extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            activity: this.props.activity
        };
        this.bindMethods();
        this.fetchActivities();
    }

    bindMethods() {

    }

    fetchActivities() {
        axios.get(`/api/activities/${this.props.activity.id}`)
            .then((resp) => {
                this.setState({activity: resp.data, isLoading: false});
            });
    }

    updateActivity(activity: ActivityModel) {
        axios.put(`/api/activities/${this.state.activity.id}`, activity)
            .then((resp) => {
                this.setState({activity: resp.data});
                this.props.afterModify();
            });  
    };

    activityDescription() {
        return <div>
                {this.state.activity.content}
            </div>;
    }


    view() {
        if (this.state.isLoading) {
            return <MDBCard>
                <MDBCardBody>
                    <SmallSpinner/>
                </MDBCardBody>
            </MDBCard>
        }
        return <MDBCard>
            <MDBCardBody className={"text-left"}>   
                {this.activityDescription()}
            </MDBCardBody>
        </MDBCard>
    }

    render() {
        return this.view();
    }
}