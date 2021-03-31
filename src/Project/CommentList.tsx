import * as React from "react";
import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	Grid,
	Typography,
} from "@material-ui/core";
import { Comment } from "../../Models/Comment";
import { getDateString } from "../../Models/Utils";

type CommentListProp = {
	comments: Comment[];
};

const CommentList: React.FC<CommentListProp> = ({
	comments,
}: CommentListProp) => {
	return (
		<Grid container spacing={2} direction="column">
			{comments.map((comment: Comment) => (
				<Grid item key={comment.id} id={comment.id}>
					<Card>
						<CardContent>
							<CardHeader
								avatar={<Avatar alt={comment.userName ? comment.userName : comment.userId} src={comment.userPhotoURL} />}
								title={comment.userName ? comment.userName : comment.userId}
								subheader={getDateString(comment.dateCreated)}
							/>
							<Typography variant="body2" component="p">
								{comment.text}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

export default CommentList;
