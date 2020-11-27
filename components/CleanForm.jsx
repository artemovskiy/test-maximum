import React from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    heading: {
      marginTop: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(2)
    },
    pre: {
        padding: theme.spacing(),
        backgroundColor: "#CCCCCC",
        overflowX: 'auto'
    },
    progressBlock: {
        width: '100%',
        height: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        direction: 'column'
    },
    error: {
        backgroundColor: "red"
    }
}))

export default function CleanForm(props) {
    const {query, data, pending, onQueryChange} = props

    const styles = useStyles()

    return <Container>
        <Typography variant="h2" className={styles.heading}>Clean form</Typography>
        <Paper className={styles.paper}  style={props.error ? {backgroundColor: '#F5BEB3'} : {}}>
            <div>
                <TextField
                    fullWidth={true}
                    label="название в произвольной форме"
                    value={query}
                    onChange={e => onQueryChange(e.target.value)}
                />
            </div>
            { props.error && <Typography color="error">{props.error.message}</Typography> }
            { pending && <div className={styles.progressBlock}>
                <CircularProgress />
            </div> }
            { !!data && <pre className={styles.pre}>{JSON.stringify(data, undefined, 2)}</pre>}
        </Paper>
    </Container>
}