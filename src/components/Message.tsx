import { Paper, Stack } from "@mui/material";

const Message = ({ right, text }: { right?: boolean; text: string }) => {
  return (
    <Stack direction={right ? "row-reverse" : "row"}>
      <Paper
        sx={{
          py: 1,
          px: 2,
          bgcolor: right ? "primary.main" : "",
          color: right ? "#fff" : "",
        }}
      >
        {text}
      </Paper>
    </Stack>
  );
};

export default Message;
