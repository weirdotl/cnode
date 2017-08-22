import React from 'react'
import { connect } from 'react-redux'
import * as Actions from '../actions'
import { Link } from 'react-router'
import { Icon,Form,Input,Button,Popover,BackTop,Spin,message } from 'antd'

const FormItem = Form.Item /*表单域*/
const style = {
	body: {
		backgroundColor: '#fff',
		paddingBottom: '20px',
		width: '80%',
		borderRadius: '8px',
		margin: '20px auto 20px'
	},
	header: {
		fontSize: '14px',
		width: '100%',
		borderRadius: '8px 8px 0 0',
		backgroundColor: '#f6f6f6',
		padding: '10px'
	},
	nav: {
		color: '#80bd01',
		padding: '3px 4px',
		margin: '0 10px',
		transition: 'all 0.5s'
	},
	message: {
		color: '#888',
		padding: '3px 4px',
		margin: '0 15px'
	},
	create_topic: {
		color: '#fff',
		padding: '3px 4px',
		margin: '0 15px',
		backgroundColor: '#57c5f7',
		borderRadius: '3px'
	},
	select: {
		backgroundColor: '#80bd01',
		color: '#fff',
		borderRadius: '3px'
	},
	login: {
		position: 'fixed',
		right: '10px',
		zIndex: '99'

	},
	signIn: {
		position: 'fixed',
		right: '0',
		top: '80px',
		zIndex: '99'
	},
	collectionList: {
		padding: '5px 0',
		textAlign: 'center',
		backgroundColor: '#f2f2f2',
		marginTop: '10px',
		borderRadius: '8px'
	},
	react: {
		width: '147px',
		height: '30px',
		marginBottom: '-10px'
	},
	message_numb: {
		padding: '1px 7px',
		color: '#fff',
		backgroundColor: '#80bd01',
		borderRadius: '100%'
	}
}

export class Head extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
	}

	state = {
		selected: 'all',
		loginname: 'weirdo',
		visible: false,
		form: false
	}

	componentWillMount = () => {
		const slugParam = this.getSlug()
		const username = localStorage.getItem("username") || ''
		const accesstoken = localStorage.getItem("loginname") || 'weirdo'
		if (username) {
			this.props.getMessageNum(accesstoken)
		}
		this.setState({
			selected: slugParam,
			loginname: username
		})
	}

	componentWillReceiveProps = (nextProps) => {
		const slug = nextProps.params.categorySlug
		const nextSlug = slug ? slug : 'all'
		const cnodeNow = this.props.state.cnode
		const cnodeNext = nextProps.state.cnode
		if (this.getSlug() !== nextSlug) {
			this.setState({
				selected: nextSlug
			})
		}
		if (cnodeNow.login !== cnodeNext.login && cnodeNext.login === 'success') {
			message.success('登陆成功')
			const username = localStorage.getItem("username") || ''
			this.setState({
				form: false,
				loginname: username
			})
		}
		if (cnodeNow.login !== cnodeNext.login && cnodeNext.login === 'fail') {
			message.error('登陆失败')
		}
		if (cnodeNow.login !== cnodeNext.login && cnodeNext.login === 'leave') {
			message.success('成功退出')
			this.setState({
				loginname: ''
			})
		}
	}

	signOut = () => {
		this.setState({
			visible: false
		})
		this.props.signOut()
		localStorage.clear("loginname", "username")
	}

	getSlug = () => {
		let slugParam = this.props.params.categorySlug
		slugParam = slugParam ? slugParam : 'all'
		return slugParam
	}

	signIn = () => {
		this.setState({
			form: true,
			visible: false
		})
	}

	login = (data) => {
		const {
			userLogin
		} = this.props
		userLogin(data)
		this.setState({
			modal1Visible: false
		})
	}

	handleVisibleChange = (visible) => {
		this.setState({
			visible
		})
	}

	render() {
		const username = this.state.loginname
		let that = this
		const tabList = ['all', 'good', 'share', 'ask', 'job']
		const HorizontalLoginForm = Form.create()(React.createClass({
			handleSubmit(e) {
				e.preventDefault()
				this.props.form.validateFields((err, values) => {
					if (!err) {
						that.login(values)
					}
				});
			},
			render() {
				const {
					getFieldDecorator
				} = this.props.form
				return (
					<Form inline onSubmit={this.handleSubmit}>
	        <FormItem>
	          {getFieldDecorator('accesstoken', {
	            rules: [{ required: true, message: 'Please input your username!' }],
	          })(
	            <Input addonBefore={<Icon type="user" />} placeholder="请输入你的accesstoken" />
	          )}
	        </FormItem>
	        <FormItem>
	          <Button type="primary" htmlType="submit">登陆</Button>
	        </FormItem>
	      </Form>
				);
			},
		}))
		return (
			<div style={style.body}>
				<div style={style.login}>
					<Spin tip="Loading..." spinning={this.props.state.cnode.login==='request'}>
      				<BackTop visibilityHeight='100'/>
			      	<Popover
				        content={<a onClick={username ? this.signOut : this.signIn}>{username ? '退出' : '登陆'}</a>}
				        title="登陆/退出"
				        trigger="click"
				        visible={this.state.visible}
				        onVisibleChange={this.handleVisibleChange}
				      >
	      				<Button type="primary">{username || '未登录'}</Button>
	        		</Popover>
	      			{ !username || <Link to={`/collect/${username}`}><div style={style.collectionList}>收藏列表</div></Link> }
	      			{ !username || <Link to={`/user/${username}`}><div style={style.collectionList}>个人信息</div></Link> }
	      			</Spin>
      			</div>
      			<div style={style.signIn} >
      				{this.state.form ? <HorizontalLoginForm /> : ''}
      			</div>
      			<div style={style.header}>
      				{tabList.map((value, index) => {
				    	let selected = (this.state.selected === value) ? {...style.nav, ...style.select} : style.nav
				    	const end = value.replace('ask', '问答').replace('job', '招聘').replace('share', '分享').replace('good', '精华').replace('all', '全部')
				    	return <Link style={selected} to={`/category/${value}`} key={index}>{end}</Link>
				    	}
				    )}
      				{ !username || <Link to='/message' style={style.message} >未读信息{this.props.state.message.messageNum ? <span style={style.message_numb}>{this.props.state.message.messageNum}</span> : ''}</Link>}
				    { !username || <Link to='/createtopic' style={style.create_topic} >发布主题</Link>}
      			</div>
      			{this.props.children}
      		</div>
		)
	}
}

const mapStateToProps = state => ({
	state: state
})

export default connect(
	mapStateToProps,
	Actions
)(Head)