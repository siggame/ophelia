import React from 'react'
import EditProfile from '../components/profile/EditProfile'

export default class ProfileContainer extends React.Component {
  render() {
    const bio =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum elit ac vestibulum sodales. Mauris tempor consectetur mi nec tempor. Etiam fermentum maximus lacus, quis interdum ligula lacinia ac. Maecenas sagittis metus quis sem feugiat ultricies. Praesent imperdiet tincidunt metus at mollis. Ut sit amet libero id urna accumsan varius at aliquet nulla. Fusce tortor orci, rhoncus interdum velit eget, pellentesque ullamcorper diam. Pellentesque sed vestibulum mauris. Suspendisse neque odio, rhoncus eget tempor eget, tempus quis nisl. Donec hendrerit, lorem non lacinia ultrices, erat odio rhoncus tortor, eu posuere dolor metus sed eros. Pellentesque eget nisi posuere dolor luctus vestibulum. Duis aliquam convallis est nec interdum. Sed nibh mi, tempor ut nunc id, luctus tincidunt ex. Vestibulum nec velit hendrerit nulla mollis laoreet et sit amet tellus. Nunc non fringilla mi. Duis arcu mi, congue pharetra lorem eu, pulvinar ultrices sapien.'
    return (
      <div className="container">
        <EditProfile username={'dummyUser'} teamName={'dummyTeamName'} bio={bio} primaryContactEmail={'me@me.com'} primaryContactName={'dummy name'} imageUrl={''} />
      </div>
    )
  }
}
