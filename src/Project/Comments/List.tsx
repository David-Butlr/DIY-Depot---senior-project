import * as React from "react";
import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	IconButton,
	Grid,
	Menu,
	MenuItem,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { getDateString } from "../../../Models/Utils";
import { Comment } from "../../../Models/Comment";
import { appContext } from "../../AppContext";
import { API_PATHS } from "../../Api";
import Typography from "../../Components/ATagAwareTypography";

type CommentListProp = {
	projectId: string;
	comments: Comment[];
	setComments: (comments: Comment[]) => void;
};

type CommentListItemProp = {
	comment: Comment;
	selectedComment: Comment | null;
	setAnchorEl: (anchorEl: HTMLElement | null) => void;
	setSelectedComment: (comment: Comment | null) => void;
};

const CommentListItem: React.FC<CommentListItemProp> = ({
	comment,
	setAnchorEl,
	setSelectedComment,
}: CommentListItemProp) => {
	const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
		setSelectedComment(comment);
	};
	return (
		<Grid item key={comment.id}>
			<Card>
				<CardContent>
					<CardHeader
						avatar={<Avatar aria-label="recipe">R</Avatar>}
						action={
							<IconButton
								aria-label="settings"
								onClick={openMenu}
							>
								<MoreVert />
							</IconButton>
						}
						title={comment.userId}
						subheader={getDateString(comment.dateCreated)}
					/>
					<Typography variant="body2" text={comment.text} />
				</CardContent>
			</Card>
		</Grid>
	);
};

const CommentList: React.FC<CommentListProp> = ({
	projectId,
	comments,
	setComments,
}: CommentListProp) => {
	const [
		selectedComment,
		setSelectedComment,
	] = React.useState<Comment | null>(null);
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const context = React.useContext(appContext);

	const deleteComment = () => {
		if (!selectedComment) return;
		context.api
			.delete(
				API_PATHS.PROJECT,
				`/${projectId}/comment/${selectedComment.id}`
			)
			.then((result) => {
				if (result.status >= 200 && result.status <= 299) {
					context.openError("Comment deleted");
					setComments(
						comments.filter((c) => c.id !== selectedComment.id)
					);
				} else {
					context.openError("Failed to delete comment");
				}
			})
			.catch(() => context.openError("Failed to delete comment"));
	};

	const flagComment = () => {
		context.openError("Flagged");
	};
	return (
		<Grid container spacing={2} direction="column">
			{comments.map((comment: Comment) => (
				<CommentListItem
					comment={comment}
					key={comment.id}
					selectedComment={selectedComment}
					setSelectedComment={setSelectedComment}
					setAnchorEl={setAnchorEl}
				/>
			))}
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				open={selectedComment !== null}
				onClose={() => {
					setSelectedComment(null);
					setAnchorEl(null);
				}}
			>
				<MenuItem onClick={flagComment}>Flag</MenuItem>
				<MenuItem onClick={deleteComment}>Delete</MenuItem>
			</Menu>
		</Grid>
	);
};

export default CommentList;
