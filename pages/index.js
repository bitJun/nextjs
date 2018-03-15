import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import React from 'react'
import Api from 'Api/index'
import { NavBar, Icon, ListView, PullToRefresh, SearchBar } from 'antd-mobile';
import { JnProjectBar } from 'Module';
import moment from 'moment';
import style_layout from './scss/layout.css';
import style from './scss/project.css';


let data = [];
let index = -1;
const NUM_SECTIONS = 10;
const NUM_ROWS_PER_SECTION = 10;
let pageIndex = 0;
let oldData = '';
let params = { pageNo: 1, pageSize: 10, projectCategory: '', projectStatus: '', projectName: '' };

export default class projectList extends React.Component {
	constructor(props, context) {
		super(props);
		const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
		const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.sectionIDs = [];
    this.rowIDs = [];
		this.state = {
			data: [],
      dataSource: dataSource.cloneWithRows(data),
      isLoading: false,
      hasMore: true,
      refreshing: false,
			projectName: params.projectName,
			params: {
				type: params.projectCategory,
				status: params.projectStatus
			}
		}
		this.genData = (pIndex = 0) => {
      for (let i = 0; i < NUM_SECTIONS; i++) {
        const ii = (pIndex * NUM_SECTIONS) + i;
        const sectionName = `Section ${ii}`;
        this.sectionIDs.push(sectionName);
        data[sectionName] = sectionName;
        this.rowIDs[ii] = [];

        for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
          const rowName = `S${ii}, R${jj}`;
          this.rowIDs[ii].push(rowName);
          data[rowName] = rowName;
        }
      }
      this.sectionIDs = [].concat(this.sectionIDs);
      this.rowIDs = [].concat(this.rowIDs);
    };
	}

	componentDidMount() {
		if (data.length === 0) {
			this.manuallyRefresh = true;
			this.onRefresh();
		}
	}

	onEndReached = (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    this.setState({ isLoading: true });
    this.getData(++pageIndex);
  };

  onRefresh = () => {
    if (!this.manuallyRefresh) {
      this.setState({ refreshing: true });
    } else {
      this.manuallyRefresh = false;
    }
    params.pageNo = 1;
    pageIndex = 0;
		Api.use('getProjectList', (config) => {
			config.params = params;
			return config;
		}, (responseJson) => {
			data = responseJson.data.result;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(data),
				refreshing: false,
			});
		})
  };

	getData(pIndex = 0) {
    params.pageNo = pIndex + 1;
		Api.use('getProjectList', (config) => {
			config.params = params;
			return config;
		}, (responseJson) => {
			var newData = responseJson.data.result;
			if (!newData.length) {
				return this.setState({ hasMore: false });
			}
			data = data.concat(responseJson.data.result);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(data),
				isLoading: false,
			});
		})

  }

  reloadData() {
    this.manuallyRefresh = true;
    setTimeout(() => {
			this.setState({ refreshing: true, hasMore:true });
			this.onRefresh();
			//document.body.scrollTop = 0;
		}, 10);
  }

	shouldComponentUpdate (nextProps, nextState) {
		return true;
	}

	handleType(value) {
		params.projectCategory = value.value;
		this.reloadData();
	}

	handleStatus(value) {
		params.projectStatus = value.value;
    this.reloadData();
  }
  goPath(ob){
		data.forEach((v, i ,a) => {
			v.activeStatus = false;
		})
		ob.activeStatus = true;
		//document.getElementById(ob.id).style['backgroundColor'] = 'rgba(17, 140, 238, .08)';
		setTimeout(() => {
			let url = ob.projectCategory === 1 ? '/main-pro-detail/' : '/pro-detail/';
	    this.props.history.push(url + ob.id);
		}, 100);
  }
	render() {
		const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#f5f5f5',
          height: 10,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    const row = (rowData, sectionID, rowID) => {
      if (rowData) {
        return (
          <div styleName={rowData.activeStatus ? 'style.project-detail style.project-detail_active' : 'style.project-detail'} id={rowData.id} key={rowID} onClick={() => this.goPath(rowData)}>
            <div styleName="style.row-header">
							<img src={rowData.projectCategory == 1 ? project1 : project2} />
							<div styleName="style.row-project-title">{rowData.projectCategoryName}</div>
							<div styleName="style.row-project-status">{rowData.projectStatusName}</div>
						</div>
						<div styleName="style.row-project-name">{rowData.projectName}&nbsp;&nbsp;|&nbsp;&nbsp;{rowData.projectSponsor}</div>
						<div styleName="style.row-project-time">项目时间：{moment(rowData.projectStartTime).format('YYYY-MM-DD')}~{moment(rowData.projectEndTime).format('YYYY-MM-DD')}</div>
          </div>
        );
      } else {
        return (
          <div key={rowID}></div>
        );
      }
    };

		return (
      <div>
				<div styleName="style.project-header">
	        <SearchBar
						placeholder="请输入项目关键字"
						value={this.state.projectName}
						onChange={(value) => {
							this.setState({
								projectName: value
							})
						}}
						onSubmit={(value) => {
							params.projectName = value;
							this.manuallyRefresh = true;
					    setTimeout(() => {
								this.setState({ refreshing: true, hasMore:true });
								this.onRefresh();
								//document.body.scrollTop = 0;
							}, 10);
						}}
					/>
					{/* <JnProjectBar
	          data={this.state.params}
	          handleType={(value) => this.handleType(value)}
	          handleStatus={(value) => this.handleStatus(value)}
	        /> */}
				</div>
				<div style={{paddingTop: '64px'}}>
          <ListView ref="lv"
            dataSource={this.state.dataSource}
						renderHeader={() => {}}
            renderRow={row}
						renderSeparator={separator}
						className="project-list"
						useBodyScroll
            pageSize={10}
            scrollRenderAheadDistance={500}
						onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
						pullToRefresh={<PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
          />
        </div>
      </div>
		);
	}
}
// export default () => (
//   <projectList />
// )
