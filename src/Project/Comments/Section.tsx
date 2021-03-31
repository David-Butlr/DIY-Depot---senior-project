import * as React from "react";
import { Grid } from "@material-ui/core";
import { Comment } from "../../../Models/Comment";
import { API_PATHS } from "../../Api";
import { appContext } from "../../AppContext";
import CommentForm from "./Form";
import CommentList from "./List";

type CommentSectionProps = {
	projectId: string;
};

const sortComments = (comments: Comment[]) => {
	return comments.sort((a, b) => {
		if (a.dateCreated > b.dateCreated) return -1;
		if (b.dateCreated < a.dateCreated) return 1;
		return 0;
	});
};

const CommentSection: React.FC<CommentSectionProps> = ({
	projectId,
}: CommentSectionProps) => {
	const context = React.useContext(appContext);
	const [comments, setComments] = React.useState<Comment[]>([]);
	React.useEffect(() => {
		context.api
			.get(API_PATHS.PROJECT, `/${projectId}/comments`)
			.then((results) => {
				if (results.status >= 200 && results.status <= 299) {
					setComments(sortComments(results.data as Comment[]));
				} else {
					context.openError(results.data as string);
				}
			})
			.catch(() => context.openError("Failed to get comments"));
	}, []);
	return (
		<Grid>
			<CommentForm
				projectId={projectId}
				addComment={(c: Comment) =>
					setComments(sortComments([...comments, c]))
				}
			/>
			<CommentList
				comments={comments}
				projectId={projectId}
				setComments={setComments}
			/>
		</Grid>
	);
};

export default CommentSection;
