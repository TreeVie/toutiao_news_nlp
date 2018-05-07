import Base from "../base/base";
import "./modal.less"

interface ModalProps {
    title?: string;
    children?: JSX.Element;
    style?: StyleSheet;
}

export default class Modal extends Base<ModalProps, any> {
    render() {
        const { style = {}, title, children } = this.props;
        return (
            <div>
                <div className="modal-mask" />
                <div className="modal-content" style={{ ...style }}>
                    {title && <p className="modal-title">{title}</p>}
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        );
    }
}