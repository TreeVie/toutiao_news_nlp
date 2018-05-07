import * as React from "react"

export default class Base<T,S> extends React.Component<T,S>{
    constructor(props){
        super(props)
        this.state = {} as S;
    }
}