import * as React from "react";
import {
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@material-ui/core";
import { Delete, KeyboardArrowRight } from "@material-ui/icons";

type ResourceListProps = {
	resources: string[];
	onDelete?: (index: number) => void;
};

const ResourceList: React.FC<ResourceListProps> = ({
	resources,
	onDelete,
}: ResourceListProps) => {
	return (
		<Grid>
			<Typography>
				Project Materials (Total: {resources.length})
			</Typography>
			<List>
				{resources.map((resource, i) => {
					return (
						<ListItem
							key={`${i}-${resource}`}
							role={undefined}
							dense
						>
							<ListItemIcon>
								<KeyboardArrowRight fontSize="small" />
							</ListItemIcon>
							<ListItemText primary={resource} />
							{onDelete ? (
								<ListItemIcon>
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() => onDelete(i)}
									>
										<Delete fontSize="small" />
									</IconButton>
								</ListItemIcon>
							) : null}
						</ListItem>
					);
				})}
			</List>
		</Grid>
	);
};

export default ResourceList;
