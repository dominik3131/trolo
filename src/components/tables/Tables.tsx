import React from 'react';
import TableModel from "../../data-models/TableModel";
import {MDBContainer, MDBRow, MDBCol} from "mdbreact";
import {Link} from "react-router-dom";
import CreateTable from "./CreateTable";
import axios from "axios";
import Spinner from "../../utils/Spinner";

interface Props {
}

interface State {
    tables: TableModel[]
    isLoading: boolean
}

export default class Tables extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            tables: [],
            isLoading: true
        };
        this.fetchTables();
    }

    fetchTables() {
        axios.get(`/api/tables`,{
            headers: {
                'Authorization': 'token' + localStorage.getItem('user_token')
            }
        })
            .then((resp) => {
                this.setState({tables: resp.data, isLoading: false});
            });
    }

    lastSeenTables = () => {
        let lastTables: any[];
        lastTables = [];
        this.state.tables.sort((a: TableModel, b: TableModel) => {
            return new Date(b.last_open).getTime() - new Date(a.last_open).getTime();
        })
            .filter((table, index) => (index < 4))
            .forEach(table =>
                lastTables.push(
                    <MDBCol key={table.id} md="3">
                        <Link to={{
                            pathname: `/tables/${table.id}`
                        }}>
                            {table.name}
                            <img src={table.background} className="img-thumbnail" alt=""/>
                        </Link>
                    </MDBCol>)
            );
        if (lastTables.length > 0) {
            return <MDBContainer className="mt-5">
                <MDBRow className="mb-1">
                    <h3><i className="far fa-user"/> Last Seen</h3>
                </MDBRow>
                <MDBRow className="mb-2">
                    {lastTables}
                </MDBRow>
            </MDBContainer>;
        } else {
            return null;
        }
    };

    privateTables = () => {
        let privateTables: any[];
        privateTables = [];
        this.state.tables.filter(table => table.visibility === 0)
            .forEach(table =>
                privateTables.push(
                    <MDBCol key={table.id} md="3">
                        <Link to={{
                            pathname: `/tables/${table.id}`
                        }}>
                            {table.name}
                            <img src={table.background} className="img-thumbnail" alt=""/>
                        </Link>
                    </MDBCol>)
            );
        if (privateTables.length > 0) {
            return <MDBContainer className="mt-5">
                <MDBRow className="mb-1">
                    <h3><i className="far fa-clock"/> Private</h3>
                </MDBRow>
                <MDBRow className="mb-2">
                    {privateTables}
                </MDBRow>
            </MDBContainer>;
        } else {
            return null;
        }
    };

    favouriteTables = () => {
        let favouriteTables: any[];
        favouriteTables = [];
        this.state.tables.filter(table => table.favourite)
            .forEach(table =>
                favouriteTables.push(
                    <MDBCol key={table.id} md="3">
                        <Link to={{
                            pathname: `/tables/${table.id}`
                        }}>
                            {table.name}
                            <img src={table.background} className="img-thumbnail" alt=""/>
                        </Link>
                    </MDBCol>)
            );
        if (favouriteTables.length > 0) {
            return <MDBContainer className="mt-5">
                <MDBRow className="mb-1">
                    <h3><i className="far fa-star"/> Favourite</h3>
                </MDBRow>
                <MDBRow className="mb-2">
                    {favouriteTables}
                </MDBRow>
            </MDBContainer>;
        } else {
            return null;
        }
    };

    view() {
        if (this.state.isLoading)
            return <Spinner/>;
        return [
            <CreateTable/>,
            this.lastSeenTables(),
            this.privateTables(),
            this.favouriteTables(),
        ]
    };

    render() {
        return this.view()
    }
}
