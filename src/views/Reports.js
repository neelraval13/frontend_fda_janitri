import React from 'react';
import MyNavbar from '../components/navbar';
import {Container, Row, Col} from 'reactstrap';
import {fetchData, lookupOptionsGET } from '../helpers/fetch_data.js'
import {withRouter} from "react-router-dom";
import ReportGrid from '../components/ReportGrid.js'
import ReportTotalData from "../components/ReportTotalData";
import {ORDER_REPORT_ENDPOINT, TABLES_ENDPOINT, ORDERS_ENDPOINT} from "../helpers/endpoint.js";


class Report extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            tables: [],
            date_start: new Date(),
            date_end: new Date(),
            reports:{
                total: 0,
                count: 0,
                avg: 0
            },
            doneLoading: false
        }
    }

    getOrders(endpoint, type_=false){
        const thisComp = this;
        fetchData(endpoint, thisComp, 'orders', type_)
    }

    getTables(){
        const endpoint = TABLES_ENDPOINT;
        const thisComp = this;
        fetchData(endpoint, thisComp, 'tables', true)
    }


    getReports(endpoint){
        const thisComp = this;
        fetch(endpoint, lookupOptionsGET).then(
            function(reps){
                return reps.json()
            }
        ).then(
            function(responseData){
                const reports = {
                    total: responseData.total,
                    count: responseData.count,
                    avg: responseData.avg
                };
                thisComp.setState({
                     reports: reports
                })
            }
        )
    }

    handleClearFilters = () => {
        this.componentDidMount()
    };

    updateReport = (selected_category) =>{
        const endpoint = ORDER_REPORT_ENDPOINT+ '?table=' + selected_category;
        this.getReports(endpoint)
    };

    handleSelectedCategories = (selectedCategories) =>{
        if(selectedCategories){
            const endpoint = ORDERS_ENDPOINT + '?table=' + selectedCategories;
            this.getOrders(endpoint)
        }
    };

    componentDidMount() {
        this.getOrders(ORDERS_ENDPOINT, false);
        this.getReports(ORDER_REPORT_ENDPOINT);
        this.getTables();
    }
    
    render() {
        return(
             <div>
                <MyNavbar />
                <Container>
                    <Row>
                        <Col xs="8">
                            <ReportGrid orders={this.state.orders} />
                        </Col>
                        <Col xs="4">
                            <ReportTotalData
                                categories={this.state.tables}
                                handleSelectedCategories={this.handleSelectedCategories}
                                updateReport={this.updateReport}
                                reports={this.state.reports}
                                handleClearFilters={this.handleClearFilters}
                            />
                        </Col>
                    </Row>
                </Container>
             </div>
        )
    }

}

export default withRouter(Report);