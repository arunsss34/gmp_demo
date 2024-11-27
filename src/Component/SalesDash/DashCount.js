import React, { useState, useContext} from "react";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import SellIcon from '@mui/icons-material/Sell';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ThemeContext from '../ThemeContext';


const StyledCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2],
  position: 'relative',
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  fontWeight: 'bold',
}));

const formatToLakhs = (amount) => {
  if (amount === null || amount === undefined) return '0';
  return (amount / 100000).toFixed(2) + ' Lakh';
};

const DashCount = ({ count,count1, type }) => {

  const { currentTheme } = useContext(ThemeContext);
  return (
 <Grid container spacing={3}>
      {type == 2 ? ( <><Grid item xs={12} sm={6}>
        <StyledCard sx={{ background: currentTheme.background }}>
          <CardTitle variant="h6" sx={{ color:  currentTheme.text, fontSize: 16 }}>
            No Of Bills
          </CardTitle><br />
          <CardContentStyled>
            <Typography variant="h5" sx={{ color: currentTheme.text, fontWeight: 'bold',fontSize: 16 }}>
              {count.no_of_bills}
            </Typography>
            <SellIcon fontSize="large" sx={{ color: currentTheme.text }} />
          </CardContentStyled>
        </StyledCard>
      </Grid>
      {/* <Grid item xs={12} sm={4}>
        <StyledCard sx={{ background:  currentTheme.background}}>
          <CardTitle variant="h6" sx={{ color: currentTheme.text, fontSize: 16 }}>
            Taxable Amount
          </CardTitle><br />
          <CardContentStyled>
            <Typography variant="h5" sx={{ color: currentTheme.text, fontWeight: 'bold',fontSize: 16 }}>
              {formatToLakhs(count.TaxableAmount)}
            </Typography>
            <CurrencyRupeeIcon fontSize="large" sx={{ color: currentTheme.text }} />
          </CardContentStyled>
        </StyledCard>
      </Grid> */}
      <Grid item xs={12} sm={6}>
        <StyledCard sx={{ background: currentTheme.background}}>
          <CardTitle variant="h6" sx={{ color: currentTheme.text, fontSize: 16 }}>
            Net Amount
          </CardTitle><br />
          <CardContentStyled>
            <Typography variant="h5" sx={{ color: currentTheme.text, fontWeight: 'bold',fontSize: 16 }}>
              {formatToLakhs(count.NetAmount)}
            </Typography>
            <CurrencyRupeeIcon fontSize="large" sx={{ color: currentTheme.text }} />
          </CardContentStyled>
        </StyledCard>
      </Grid></>) : (<>
        <Grid item xs={12} sm={6}>
        <StyledCard sx={{ background:  currentTheme.background}}>
          <CardTitle variant="h6" sx={{ color: currentTheme.text, fontSize: 16 }}>
          Net Amount
          </CardTitle><br />
          <CardContentStyled>
            <Typography variant="h5" sx={{ color: currentTheme.text, fontWeight: 'bold',fontSize: 16 }}>
              Sales : {formatToLakhs(count.TaxableAmount)}
            </Typography>
            <CurrencyRupeeIcon fontSize="large" sx={{ color: currentTheme.text }} />
          </CardContentStyled>
        </StyledCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <StyledCard sx={{ background: currentTheme.background}}>
          <CardTitle variant="h6" sx={{ color: currentTheme.text, fontSize: 16 }}>
            Net Amount
          </CardTitle><br />
          <CardContentStyled>
            <Typography variant="h5" sx={{ color: currentTheme.text, fontWeight: 'bold',fontSize: 16 }}>
              Receipts: {formatToLakhs(count1.BalanceAmount)}
            </Typography>
            <CurrencyRupeeIcon fontSize="large" sx={{ color: currentTheme.text }} />
          </CardContentStyled>
        </StyledCard>
      </Grid>
      
      </>)
      
      
      
      }
    </Grid>
  );
}

export default DashCount;
