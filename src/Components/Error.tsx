import Snackbar from "@material-ui/core/Snackbar";
import * as React from "react";

type ErrorDisplayProps = {
	message: string;
	onClose: () => void;
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
	message,
	onClose,
}: ErrorDisplayProps) => {
	return (
		<Snackbar
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left",
			}}
			open
			autoHideDuration={6000}
			onClose={onClose}
			message={message}
		/>
	);
};

export default ErrorDisplay;
