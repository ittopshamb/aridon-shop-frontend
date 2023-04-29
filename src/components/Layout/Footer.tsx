import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

interface FooterProps {
  description: string;
  title: string;
}

export default function Footer(props: FooterProps) {
  const { description, title } = props;

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, position: 'static', bottom: 0, left: 0, width: '100%',height:'200px' }}>
      <Container maxWidth="lg">
        {/*<Typography variant="h6" align="center" gutterBottom>*/}
        {/*  {title}*/}
        {/*</Typography>*/}
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Contacts: <a href="mailto:aridonshop@gmail.com">aridonshop@gmail.com</a>
        </Typography>
        <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
        >
          @2023 ittopshamb | All Rights Reserved
        </Typography>
      </Container>
    </Box>
  );
}
