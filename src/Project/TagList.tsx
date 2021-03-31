import * as React from "react";
import {
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import { Tag } from "../../Models/Tag";

type TagListProps = {
	listHeader: string;
	tags: Tag[];
	actionComponent?: (tag: Tag) => JSX.Element;
};

const TagList: React.FC<TagListProps> = ({
	listHeader,
	tags,
	actionComponent,
}: TagListProps) => {
	return (
		<Grid>
			<Typography>{listHeader}</Typography>
			<List>
				{tags.map((tag) => {
					return (
						<ListItem key={tag.id} role={undefined} dense>
							<ListItemIcon>
								<KeyboardArrowRight fontSize="small" />
							</ListItemIcon>
							<ListItemText primary={tag.name} />
							{actionComponent ? actionComponent(tag) : null}
						</ListItem>
					);
				})}
			</List>
		</Grid>
	);
};

export default TagList;
