import React from 'react';
import candidatedata from '../data/candidatedata';
import { titleData, tagData} from '../data/tagandtitledata';
import { Dropdown, Card, Button, Header, Grid } from 'semantic-ui-react';


const profiles =  candidatedata;

class CandidateFilter extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      filter:null,
      tags:null,
    };
    this.dropDownMenu = titleData;
    this.tagOptions = tagData;
  }

  onFilterSelection = (filterValue) => {
    this.setState({filter:filterValue});
  }

  doTagExistInProfile = (tags) => {
    if (!this.state.tags || this.state.tags.length === 0)
      return true;

      var allAvail = true;
      for (var j in this.state.tags){
        var individualExist = false
        for ( var i in tags){
          individualExist = individualExist || (tags[i] === this.state.tags[j]);
        }
        allAvail = allAvail && individualExist;
      }
    return allAvail;
  }

  doTitleExistInProfile = (title, role) => {
      if (!title){
        return true;
      }
      return role === title;
  }

  isAnyFilterApplied = () => {
    return this.state.filter || this.state.tags;
  }

  applyFitlerToProfiles = () => {
      var filteredProfiles = this.isAnyFilterApplied() ?  profiles.filter( profile => this.doTitleExistInProfile(this.state.filter, profile.role) && this.doTagExistInProfile(profile.tags) )  : profiles;
     console.log(filteredProfiles);
     return (<div className="profiles fadeInUp" style={{animationDelay:'1s'}}>
              <Card.Group>
                {filteredProfiles.map( profile => <CandidateProfile profile ={profile}/>)}
              </Card.Group>
             </div>
            );
  };

  jobTitleDropDown = () => {
    return (
          <Dropdown search 
            button
            onChange = {(event,data)=> this.onFilterSelection(data.value)}
            placeholder="Job Title"
            options={this.dropDownMenu}/>
    );
  }

  tagFilterSelector = (event, tags) => {
    console.log("Printing the tags", tags);
    this.setState({
      tags:tags
    });
    event.text = ""
  }

  tagSelectDropDown = () => {
    return (
          <Dropdown options={this.tagOptions}   button multiple onChange = { (event, data) => this.tagFilterSelector(event, data.value)}
          placeholder="Tags" style={{height:'auto'}} ></Dropdown>
    );
  }

  renderFilters = () => {
    return (
      <div className="filters" style={{display:'flex'}}>
          <Header  style ={{fontFamily:'Archia', color:'#343a40', verticalAlign:'middle', margin:'auto', marginLeft:'-3px', width:'auto'}}>Filter Candidates</Header>
          {this.tagSelectDropDown()}
          {this.jobTitleDropDown()}
      </div>
    );
  }  
  render() {
  return (
      <>
        {this.renderFilters()}
        {this.applyFitlerToProfiles()}
      </>
    );
  }
}


class CandidateProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emailVisible:false
    };
  }

  showMoreHandler = () => (
    this.setState({showMore:true})
  )

  showEmail = () => (
      this.setState({emailVisible:true})
  )
  hideEmail = () => {
    this.setState({emailVisible:false})
  }

  createCard = (profile) => {
    return (
        <Card fluid className="profileCard">
            <Card.Content 
            >
              <Card.Header>{profile.role}</Card.Header>
              <Card.Meta >{profile.exp} of Experience</Card.Meta>
              <Card.Meta>{profile.college}</Card.Meta>
              <Card.Description style={{color:'#343a40'}}>{profile.summary}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div style = { {display:'flex', flexDirection:'row'} }>
              {profile.tags.map((element, index) => {
                return this.createTags(element,index);
              })}
              </div>
              <div className="link" style={{marginLeft:'4px'}}>
                <a  href={profile.linkedin}>linkedin</a>
              </div>          
              {!this.state.emailVisible?<Button basic color='blue' onClick={this.showEmail}>Contact</Button>:<div onClick={this.hideEmail}>{profile.email}</div>}

            </Card.Content>
        </Card>
        // </div>
      );
    };


  createTags = (tags, index) => {
      return (
            <div className = "tags" key = {index}>
              {tags}
            </div>
      );
  }

  render(){
  return (
    <div className="App">
      {this.createCard(this.props.profile)}
    </div>
  );
  }
}


class Profile extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    return(
      <>
        <Header  style ={{fontFamily:'Archia', color:'#343a40'}} >Many bright students lost their Internships and Jobs offers because of Coronavirus.</Header>
        <Header as="p" style ={{fontFamily:'Archia',color:'#6c757d99'}}>If you are a company looking to hire talented people. You can hire from the list of the verified people in the right column.</Header> 
        <Header as="p" style ={{fontFamily:'Archia',color:'#6c757d99'}}>If you want to list openings in your company. 
Please fill the form.<a href="https://forms.gle/sYxi7azBMDXCgmaD8">Company Listing</a>
</Header> 


        <Header  style ={{fontFamily:'Archia', color:'#343a40'}}>If you are a student with a revoked offer.</Header>
        <Header as="p" style ={{fontFamily:'Archia',color:'#6c757d99'}}>Please fill the form below to get listed.<a href="https://forms.gle/E9ibHspkUrQwnANAA">Candidate Listing</a>
</Header> 
      </>
    );
  }

}

class Listing extends React.Component {
  render(){
    return(
      <Grid 
      // style = {{display:'flex', margin:'10px'}}
       columns={2}
       divided
       stackable
       style= {{margin:'10px'}}
      >
        <Grid.Row>
          <Grid.Column>
            <div style = {{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%vh', marginTop:'10%'}}>
              <Profile />
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style = {{alignItems:'rights'}}>
              <CandidateFilter/>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

function Home(props) {

  return (
    <div className="fadeInUp" style={{animationDelay: '0.5s'}}>
      <Listing/>
    </div>
  );
}

export default Home;
