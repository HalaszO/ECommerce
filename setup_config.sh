# Create secrets
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=Ch4mb3r0f53cr3t5
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_51IX6VFCUnkyQdSgetRT3mFLzhLyWUtuYunmiGNmZxxnblHKaimDatszIpEZgdDesK5hfkSijmziwwYNWfoZfEQyA00InGtvvoi
# Install ingress-nginx/controller-v0 for DO only!
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.45.0/deploy/static/provider/do/deploy.yaml
# Cert manager
# kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.3.0/cert-manager.yaml

