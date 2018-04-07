/**
 * 头部
 * 1. 显示LOGO
 * 2. 搜索框
 * 3. 提示信息
 * 4. 用户信息
 */

import React, { Component, PureComponent } from "react"


interface HeaderProps{
    
}

export default class Header extends Component<HeaderProps> {
    render() {
        return (
            <header role="banner">
                <div className="header">
                    <div className="logo">NLP</div>
                    <Search />
                    <UserInfo />
                </div>
            </header>
        )
    }
}

/**
 * 搜索框
 */
class Search extends PureComponent {
    render() {
        return <div className="search" />
    }
}

/**
 * 用户信息
 */
class UserInfo extends PureComponent {
    render() {
        return (
            <div className="user-info">
                <div className="msg" />
            </div>
        )
    }
}
