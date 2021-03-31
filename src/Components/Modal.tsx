import { Dialog, DialogProps, DialogTitle } from "@material-ui/core";
import * as React from "react";

export type ModalProps = {
	title?: string;
	modalBody?: JSX.Element;
} & DialogProps;

const Modal: React.FC<ModalProps> = ({
	title,
	modalBody,
	...props
}: ModalProps) => {
	return (
		<Dialog {...props}>
			{title ? (
				<DialogTitle id="form-dialog-title">{title}</DialogTitle>
			) : null}
			{modalBody ? modalBody : null}
		</Dialog>
	);
};

export default Modal;
