/* eslint global-require:0, no-nested-ternary:0 */
import { Menu, Flex } from 'antd-mobile';
import React from 'react'
import './jnProjectBar.css';

export class JnProjectBar extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      initData: '',
      status: '',
      type: '',
      showType: -1
    };

    /**
     * 基础数据
     */
    this.statuses = [{
      value: '',
      label: '全部'
    }, {
      value: 0,
      label: '未开始'
    }, {
      value: 1,
      label: '进行中'
    }, {
      value: 2,
      label: '已完成'
    }, {
      value: 3,
      label: '已结束'
    }];
    this.types = [{
      value: '',
      label: '全部'
    }, {
      value: 2,
      label: '项目'
    }]

  }

  componentWillReceiveProps(pprops) {

  }

  componentDidMount() {
    var meng = this.refs.meng;
    meng.addEventListener('click', (e) => {
      this.setState({
        showType: -1
      });
      e.stopPropagation();
    })

  }

  componentWillMount() {
    this.setState({
      status: this.props.data.status,
      type: this.props.data.type
    });
    if (this.props.data.status || this.props.data.status === 0) {
      var length = this.statuses.length;
      for (var i = 0; i < length; i++) {
        if (this.statuses[i].value == this.props.data.status) {
          this.setState({
            status: this.statuses[i]
          })
        }
      }
    }
    if (this.props.data.type || this.props.data.type === 0) {
      var length = this.types.length;
      for (var i = 0; i < length; i++) {
        if (this.types[i].value == this.props.data.type) {
          this.setState({
            type: this.types[i]
          })
        }
      }
    }
  }

  showMenu(e, i) {
    e.preventDefault();
    switch (i) {
      case 0:
        if (this.state.showType === 0) {
          this.setState({
            showType: -1
          });
        } else {
          this.setState({
            showType: i
          });
        }
        break;
      case 1:
        if (this.state.showType === 1) {
          this.setState({
            showType: -1
          });
        } else {
          this.setState({
            showType: i
          });
        }
        break;

    }
  }

  showTypeMenu() {
    return (
      <Menu styleName="search-bar-menu"
        data={this.types}
        level="1"
        value={this.state.type ? [this.state.type.value] : ['']}
        onChange={(value) => this.onChange(value, 0)}
        height='auto'
      />
    );
  }

  showStatusMenu() {
    return (
      <Menu styleName="search-bar-menu"
        data={this.statuses}
        level="1"
        value={this.state.status ? [this.state.status.value] : ['']}
        onChange={(value) => this.onChange(value, 1)}
        height='auto'

      />
    );

  }

  onChange(value, i) {
    this.setState({
      showType: -1
    });

    switch (i) {
      case 0:
        this.types.forEach((dataItem) => {
          if (dataItem.value === value[0]) {
            this.setState({
              type: dataItem
            });
            this.props.handleType(dataItem);
          }
        });

        break;

      case 1:
        this.statuses.forEach((dataItem) => {
          if (dataItem.value === value[0]) {
            this.setState({
              status: dataItem
            });
            this.props.handleStatus(dataItem);
          }
        });
        break;
    }
  }

  render() {
    const { showType } = this.state;
    return (
      <div styleName={showType > -1 ? 'menu-active' : ''}>
        <div styleName="search-bar">
          <Flex>
            <Flex.Item styleName="search-bar-menu-item" onClick={(e) => this.showMenu(e, 0)}>
              <span styleName="search-bar-title">{this.state.type ? this.state.type.label : '项目类型'}</span>
              <span styleName="search-bar-arrow" />
            </Flex.Item>
            <Flex.Item styleName="search-bar-menu-item" onClick={(e) => this.showMenu(e, 1)}>
              <span styleName="search-bar-title">{this.state.status ? this.state.status.label : '项目状态'}</span>
              <span styleName="search-bar-arrow" />
            </Flex.Item>
          </Flex>
          {
            this.state.showType === 0 ? this.showTypeMenu() : null
          }
          {
            this.state.showType === 1 ? this.showStatusMenu() : null
          }
        </div>
        <div styleName="menu-meng" ref="meng"></div>
      </div>
    );
  }
}
