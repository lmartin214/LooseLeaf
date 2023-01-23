import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { Container, Header, Card, Image, Label } from 'semantic-ui-react';

function OrderHistory() {
  const { data } = useQuery(QUERY_USER);
  let user;

  if (data) {
    user = data.user;
  }

  return (
    <>
      <Container textAlign="center" my={1}>
        <Link to="/">← Back to Products</Link>

        {user ? (
          <>
            <Header>
              Order History for {user.firstName} {user.lastName}
            </Header>
            {user.orders.map((order) => (
              <div key={order._id} my={2}>
                <Header>
                  {new Date(parseInt(order.purchaseDate)).toLocaleDateString()}
                </Header>
                <Card.Group>
                  {order.products.map(({ _id, image, name, price }, index) => (
                    <Card key={index} px={1} py={1}>
                      <Link to={`/products/${_id}`}>
                        <Image alt={name} src={`/images/${image}`} />
                        <Card.Content>
                          <Card.Header>{name}</Card.Header>
                        </Card.Content>
                      </Link>
                      <Card.Content>
                        <Label>${price}</Label>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
              </div>
            ))}
          </>
        ) : null}
      </Container>
    </>
  );
}

export default OrderHistory;