import Base from "../base/base";
import "./modal.less";
import ReactDOM from "react-dom";

interface ModalProps {
    title?: string;
    children?: JSX.Element;
    style?: StyleSheet;
    show: boolean;
    onCancel?: Function;
    onCreate?: Function;
}

interface ModalState {
    show: boolean;
}

export default class Modal extends Base<ModalProps, ModalState> {
    public div: HTMLDivElement;
    public initialized: boolean;
    constructor(props) {
        super(props);
        this.handelModalClick = this.handelModalClick.bind(this);
        this.div = document.createElement("div");
        this.state = {
            show: this.props.show
        };
        this.initialized = false;
    }

    componentWillReceiveProps(nextProps: ModalProps, nextState) {
        if (nextProps.show !== this.state.show) {
            this.setState({ show: nextProps.show });
        }
    }

    componentDidMount() {
        this.props.show && this.onCreate();
    }

    // 统一处理Modal层的点击事件
    handelModalClick(event: React.MouseEvent<HTMLDivElement>) {
        let className = (event.target as HTMLDivElement).className;

        if (className.includes("modal-mask")) {
            // 点击了蒙层
            this.onCancel();
        }
    }

    onCancel() {
        this.setState({ show: false });
        this.props.onCancel && this.props.onCancel();
    }

    onCreate() {
        this.props.onCreate && this.props.onCreate();
    }

    render() {
        return null;
    }
    componentDidUpdate() {
        let { style = {}, title, children } = this.props;
        let { show } = this.state;
        if (show) {
            document.body.appendChild(this.div);
            this.initialized = true;
            ReactDOM.render(
                <div
                    onClick={this.handelModalClick}
                    onScroll={(event: React.UIEvent<HTMLDivElement>) => {
                        event.preventDefault();
                    }}
                    onMouseMove={(event: React.MouseEvent<HTMLDivElement>) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                >
                    <div className="modal-mask" />
                    <div className="modal-content" style={{ ...style }}>
                        {title && <p className="modal-title">{title}</p>}
                        <div className="modal-body">{children}</div>
                    </div>
                </div>,
                this.div
            );
        } else {
            !this.state.show &&
                this.initialized &&
                document.body.removeChild(this.div);
        }
    }
}
