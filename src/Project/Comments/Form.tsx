import { Button, Grid, TextField } from "@material-ui/core";
import * as React from "react";
import { createBlankComment, Comment } from "../../../Models/Comment";
import { API_PATHS } from "../../Api";
import { appContext } from "../../AppContext";

type CommentFormProps = {
	projectId: string;
	addComment: (comment: Comment) => void;
};

const CommentForm: React.FC<CommentFormProps> = ({
	projectId,
	addComment,
}: CommentFormProps) => {
	const context = React.useContext(appContext);
	const [commentForm, setCommentForm] = React.useState<Comment>(() =>
		createBlankComment(context.diyDepotUser.id)
	);

	const submit = async () => {
		try {
			const result = await context.api.post(
				API_PATHS.PROJECT,
				`/${projectId}/comment`,
				commentForm
			);
			if (result.status >= 200 && result.status <= 299) {
				addComment(commentForm);
				setCommentForm(createBlankComment(context.diyDepotUser.id));
			} else {
				context.openError("Failed to create comment");
			}
		} catch (err) {
			context.openError("Failed to create comment");
		}
	};
	return (
		<Grid container spacing={2} direction="column">
			<Grid item>
				<TextField
					name="text"
					value={commentForm.text}
					label="Add Comment"
					multiline
					rows={4}
					variant="outlined"
					fullWidth
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setCommentForm({ ...commentForm, text: e.target.value })
					}
				/>
			</Grid>
			<Grid item style={{ marginBottom: "10px" }}>
				<Button
					onClick={submit}
					variant="outlined"
					size="large"
					color="primary"
				>
					Comment
				</Button>
			</Grid>
		</Grid>
	);
};

export default CommentForm;
